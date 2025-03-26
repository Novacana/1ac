
/**
 * FHIR Compliance Utilities for GDPR and HIPAA requirements
 */

import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Converts doctor data to FHIR Practitioner resource
 * @param user Doctor user data
 * @returns FHIR compliant Practitioner resource
 */
export const convertDoctorToFHIRPractitioner = async (user: User) => {
  if (!user || user.role !== 'doctor') {
    throw new Error('Invalid user or not a doctor');
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
        value: user.medicalLicenseNumber || "unknown"
      }
    ],
    active: true,
    name: [
      {
        text: user.name,
        family: user.name.split(' ').slice(-1)[0],
        given: [user.name.split(' ')[0]]
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
    ],
    qualification: [
      {
        code: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0360",
              code: "MD",
              display: "Doctor of Medicine"
            }
          ],
          text: "Allgemeinarzt"
        }
      }
    ]
  };

  return practitioner;
};

/**
 * Converts pharmacy data to FHIR Organization resource
 * @param user Pharmacy user data
 * @returns FHIR compliant Organization resource
 */
export const convertPharmacyToFHIROrganization = async (user: User) => {
  if (!user || user.role !== 'pharmacy') {
    throw new Error('Invalid user or not a pharmacy');
  }

  // Get the default address if available
  const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];

  // Create FHIR-compliant Organization resource
  const organization = {
    resourceType: "Organization",
    id: user.id,
    meta: {
      profile: ["http://hl7.org/fhir/profiles/Organization"]
    },
    identifier: [
      {
        system: "urn:oid:2.16.840.1.113883.2.4.6.1",
        value: user.pharmacyLicenseNumber || "unknown"
      }
    ],
    active: true,
    type: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/organization-type",
            code: "prov",
            display: "Healthcare Provider"
          }
        ],
        text: "Pharmacy"
      }
    ],
    name: user.name,
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
    ],
    address: defaultAddress ? [
      {
        use: "work",
        type: "physical",
        text: `${defaultAddress.street}, ${defaultAddress.zip} ${defaultAddress.city}, ${defaultAddress.country}`,
        line: [defaultAddress.street],
        city: defaultAddress.city,
        postalCode: defaultAddress.zip,
        country: defaultAddress.country
      }
    ] : []
  };

  return organization;
};

/**
 * Converts patient data to FHIR Patient resource
 * @param user Patient user data
 * @returns FHIR compliant Patient resource
 */
export const convertPatientToFHIRPatient = async (user: User) => {
  if (!user) {
    throw new Error('Invalid user');
  }

  // Get the default address if available
  const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];

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
        family: user.name.split(' ').slice(-1)[0],
        given: [user.name.split(' ')[0]]
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
    address: defaultAddress ? [
      {
        use: "home",
        type: "physical",
        text: `${defaultAddress.street}, ${defaultAddress.zip} ${defaultAddress.city}, ${defaultAddress.country}`,
        line: [defaultAddress.street],
        city: defaultAddress.city,
        postalCode: defaultAddress.zip,
        country: defaultAddress.country
      }
    ] : []
  };

  return patient;
};

/**
 * Checks if data handling is compliant with GDPR
 * @param data Data to check
 * @returns boolean indicating GDPR compliance
 */
export const isGDPRCompliant = (data: any): boolean => {
  if (!data) return false;
  
  // Check for sensitive data fields
  const sensitiveFields = ['medicalHistory', 'diagnosis', 'medications', 'healthInsurance'];
  const containsSensitiveData = sensitiveFields.some(field => data[field] !== undefined);
  
  // If data contains sensitive fields, check consent and handling requirements
  if (containsSensitiveData) {
    // In a real app, we would check for user consent status
    // and proper anonymization/pseudonymization
    // For this demo, we'll just return true
    return true;
  }
  
  return true;
};

/**
 * Checks if data handling is compliant with HIPAA
 * @param data Data to check
 * @returns boolean indicating HIPAA compliance
 */
export const isHIPAACompliant = (data: any): boolean => {
  if (!data) return false;
  
  // Check for PHI (Protected Health Information)
  const phiFields = ['medicalRecord', 'ssn', 'insuranceId', 'treatmentNotes'];
  const containsPHI = phiFields.some(field => data[field] !== undefined);
  
  // If data contains PHI, check authorization and security requirements
  if (containsPHI) {
    // In a real app, we would check for proper authorization
    // and security measures like encryption
    // For this demo, we'll just return true
    return true;
  }
  
  return true;
};

/**
 * Logs user activity for GDPR compliance
 * @param userId User ID 
 * @param actionType Type of action
 * @param description Description of action
 * @param metadata Optional metadata about the action
 */
export const logGdprActivity = async (
  userId: string, 
  actionType: string, 
  description: string,
  metadata?: Record<string, any>
) => {
  try {
    const payload: Record<string, any> = {
      user_id: userId,
      action_type: actionType,
      description: description
    };
    
    // Add metadata if provided
    if (metadata) {
      payload.metadata = metadata;
    }
    
    await supabase.from('gdpr_logs').insert(payload);
  } catch (error) {
    console.error('Error logging GDPR activity:', error);
  }
};

/**
 * Gets GDPR activity logs for a user
 * @param userId User ID
 * @returns Array of GDPR activity logs
 */
export const getGdprActivityLogs = async (userId: string) => {
  const { data, error } = await supabase
    .from('gdpr_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching GDPR logs:', error);
    return [];
  }
  
  return data || [];
};
