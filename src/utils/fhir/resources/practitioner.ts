
/**
 * FHIR Practitioner Resource Utilities
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
 * Converts doctor data to FHIR Practitioner resource
 * @param user Doctor user data
 * @returns FHIR compliant Practitioner resource
 */
export const convertToFHIRPractitioner = async (user: User) => {
  if (!user || user.role !== 'doctor') {
    throw new Error('Invalid user or not a doctor');
  }

  // Fetch license information if available
  let licenseData = null;
  try {
    const { data, error } = await supabase
      .from('doctor_licenses')
      .select('*')
      .eq('user_id', user.id)
      .single();
      
    if (!error) {
      licenseData = data;
    }
  } catch (error) {
    console.error("Error fetching doctor license:", error);
  }

  // Create FHIR-compliant Practitioner resource
  const practitioner: any = {
    resourceType: "Practitioner",
    id: user.id,
    meta: {
      profile: ["http://hl7.org/fhir/profiles/Practitioner"]
    },
    identifier: [
      {
        system: "urn:oid:1.2.36.146.595.217.0.1",
        value: licenseData?.license_number || user.medicalLicenseNumber || "unknown"
      }
    ],
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
        use: "work"
      },
      {
        system: "phone",
        value: user.phone || "",
        use: "work"
      }
    ]
  };

  // Add qualification if we have license data
  if (licenseData) {
    practitioner.qualification = [
      {
        code: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0360",
              code: "MD",
              display: "Doctor of Medicine"
            }
          ],
          text: licenseData.specialty || "Allgemeinarzt"
        },
        identifier: [
          {
            system: "urn:oid:1.2.36.146.595.217.0.1",
            value: licenseData.license_number || "unknown"
          }
        ],
        period: {
          start: licenseData.issue_date,
          end: licenseData.expiry_date
        }
      }
    ];
  }

  return practitioner;
};

/**
 * Retrieves all active practitioners from the system
 * @returns Array of FHIR Practitioner resources
 */
export const getAllPractitioners = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor');
      
    if (error) {
      throw error;
    }
    
    const practitioners = await Promise.all(
      data.map(async (doctor) => {
        const user = await mapProfileToUser(doctor);
        return await convertToFHIRPractitioner(user);
      })
    );
    
    return practitioners;
  } catch (error) {
    console.error("Error fetching practitioners:", error);
    return [];
  }
};
