
/**
 * FHIR Patient Resource Utilities
 */

import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

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
    
    return await convertToFHIRPatient(data as User);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return null;
  }
};
