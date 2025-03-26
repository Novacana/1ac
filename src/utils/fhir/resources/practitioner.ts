
/**
 * FHIR Practitioner Resource Utilities
 */

import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

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
  const practitioner = {
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
        return await convertToFHIRPractitioner(doctor as User);
      })
    );
    
    return practitioners;
  } catch (error) {
    console.error("Error fetching practitioners:", error);
    return [];
  }
};
