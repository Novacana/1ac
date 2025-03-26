
/**
 * FHIR Patient Resource Utilities
 */

import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Maps a database profile to a User object
 * @param profile Profile data from database
 * @returns User object with required properties
 */
const mapProfileToUser = async (profile: any): Promise<User> => {
  // Fetch addresses if available
  let addresses = [];
  try {
    const { data: addressData, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', profile.id);
      
    if (!error && addressData) {
      addresses = addressData.map(addr => ({
        id: addr.id,
        street: addr.street,
        city: addr.city,
        zip: addr.zip,
        state: addr.state,
        country: addr.country,
        isDefault: addr.is_default,
        additionalInfo: addr.additional_info
      }));
    }
  } catch (error) {
    console.error("Error fetching user addresses:", error);
  }

  // Fetch documents if available
  let documents = [];
  try {
    const { data: docsData, error } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', profile.id);
      
    if (!error && docsData) {
      documents = docsData.map(doc => ({
        id: doc.id,
        type: doc.type,
        name: doc.name,
        status: doc.status,
        uploadedAt: new Date(doc.uploaded_at)
      }));
    }
  } catch (error) {
    console.error("Error fetching user documents:", error);
  }

  return {
    id: profile.id,
    name: profile.name || '',
    email: profile.email || '',
    role: profile.role || 'user',
    phone: profile.phone || '',
    addresses: addresses,
    paymentMethods: [],
    identificationStatus: profile.identification_status as any || 'not_verified',
    verificationStatus: profile.verification_status as any || 'not_verified',
    verificationDocuments: documents,
    pharmacyLicenseNumber: profile.pharmacy_license_number,
    medicalLicenseNumber: profile.medical_license_number
  };
};

/**
 * Converts user data to FHIR Patient resource
 * @param user User data
 * @returns FHIR compliant Patient resource
 */
export const convertToFHIRPatient = async (user: User) => {
  if (!user) {
    throw new Error('Invalid user');
  }

  // Fetch addresses if available
  let addresses = [];
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id);
      
    if (!error && data) {
      addresses = data;
    }
  } catch (error) {
    console.error("Error fetching user addresses:", error);
  }

  // Create FHIR-compliant Patient resource
  const patient = {
    resourceType: "Patient",
    id: user.id,
    meta: {
      profile: ["http://hl7.org/fhir/profiles/Patient"]
    },
    active: true,
    name: [
      {
        text: user.name,
        family: user.name?.split(' ').slice(-1)[0] || "",
        given: [user.name?.split(' ')[0] || ""]
      }
    ],
    telecom: [
      {
        system: "email",
        value: user.email,
        use: "home"
      },
      {
        system: "phone",
        value: user.phone || "",
        use: "mobile"
      }
    ],
    address: addresses.map(addr => ({
      use: addr.is_default ? "home" : "temp",
      type: "physical",
      text: `${addr.street}, ${addr.zip} ${addr.city}, ${addr.country}`,
      line: [addr.street],
      city: addr.city,
      postalCode: addr.zip,
      country: addr.country
    }))
  };

  return patient;
};

/**
 * Retrieves a specific patient by ID
 * @param userId User ID
 * @returns FHIR Patient resource
 */
export const getPatient = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      throw error;
    }
    
    const user = await mapProfileToUser(data);
    return await convertToFHIRPatient(user);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return null;
  }
};
