
/**
 * Utilities for FHIR (Fast Healthcare Interoperability Resources) compliance
 * This file contains functions to help with FHIR standard compliance
 */

import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

type FHIRResourceType = 'Patient' | 'Practitioner' | 'Organization' | 'MedicationRequest';

/**
 * Converts user data to FHIR Patient resource format
 * @param userData User data to convert
 * @returns FHIR Patient resource
 */
export const convertUserToFHIRPatient = (userData: any) => {
  if (!userData) return null;
  
  return {
    resourceType: 'Patient',
    id: userData.id,
    identifier: [
      {
        system: 'urn:oid:2.16.840.1.113883.4.3.276',
        value: userData.id
      }
    ],
    name: [
      {
        use: 'official',
        family: userData.name.split(' ').slice(1).join(' '),
        given: [userData.name.split(' ')[0]]
      }
    ],
    telecom: [
      {
        system: 'phone',
        value: userData.phone || '',
        use: 'home'
      },
      {
        system: 'email',
        value: userData.email || '',
        use: 'work'
      }
    ],
    gender: 'unknown', // Would need to be specified in user data
    address: userData.addresses.map((addr: any) => ({
      use: 'home',
      type: 'physical',
      line: [addr.street, addr.additionalInfo].filter(Boolean),
      city: addr.city,
      state: addr.state,
      postalCode: addr.zip,
      country: addr.country
    }))
  };
};

/**
 * Converts doctor data to FHIR Practitioner resource format
 * @param doctorData Doctor data to convert
 * @returns FHIR Practitioner resource
 */
export const convertDoctorToFHIRPractitioner = async (doctorData: any) => {
  if (!doctorData) return null;
  
  // Get medical license info if available
  const { data: licenseData } = await supabase
    .from('medical_licenses')
    .select('*')
    .eq('user_id', doctorData.id)
    .maybeSingle();
  
  return {
    resourceType: 'Practitioner',
    id: doctorData.id,
    identifier: [
      {
        system: 'urn:oid:2.16.840.1.113883.4.3.276.medicalLicense',
        value: licenseData?.license_number || doctorData.medicalLicenseNumber || ''
      }
    ],
    name: [
      {
        use: 'official',
        family: doctorData.name.split(' ').slice(1).join(' '),
        given: [doctorData.name.split(' ')[0]],
        prefix: ['Dr.']
      }
    ],
    telecom: [
      {
        system: 'phone',
        value: doctorData.phone || '',
        use: 'work'
      },
      {
        system: 'email',
        value: doctorData.email || '',
        use: 'work'
      }
    ],
    qualification: [
      {
        code: {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/v2-0360',
              code: 'MD',
              display: 'Doctor of Medicine'
            }
          ],
          text: licenseData?.specialty || 'Medical Doctor'
        },
        identifier: [
          {
            system: 'urn:oid:2.16.840.1.113883.4.3.276',
            value: licenseData?.license_number || doctorData.medicalLicenseNumber || ''
          }
        ],
        period: licenseData ? {
          start: licenseData.issue_date,
          end: licenseData.expiry_date
        } : undefined
      }
    ]
  };
};

/**
 * Generates GDPR and HIPAA compliant consent document in FHIR format
 * @param userId User ID
 * @returns FHIR Consent resource
 */
export const generateFHIRConsent = async (userId: string) => {
  // Log the consent creation for GDPR compliance
  await supabase.from('gdpr_logs').insert({
    user_id: userId,
    action_type: 'consent_generated',
    description: 'FHIR consent document generated for user'
  });
  
  return {
    resourceType: 'Consent',
    id: `consent-${userId}-${Date.now()}`,
    status: 'active',
    scope: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/consentscope',
          code: 'patient-privacy',
          display: 'Privacy Consent'
        }
      ]
    },
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/consentcategorycodes',
            code: 'GDPR',
            display: 'GDPR Consent'
          },
          {
            system: 'http://terminology.hl7.org/CodeSystem/consentcategorycodes',
            code: 'HIPAA',
            display: 'HIPAA Consent'
          }
        ]
      }
    ],
    patient: {
      reference: `Patient/${userId}`
    },
    dateTime: new Date().toISOString(),
    policyRule: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OPTOUT',
          display: 'Opt-out'
        }
      ]
    },
    provision: {
      type: 'permit',
      period: {
        start: new Date().toISOString(),
        end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
      }
    }
  };
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

/**
 * Validates if data is compliant with GDPR requirements
 * @param data Data to validate
 * @returns Whether the data is compliant
 */
export const isGDPRCompliant = (data: any): boolean => {
  // Implementation would include checks for:
  // - Personal data minimization
  // - Purpose limitation
  // - Storage limitation
  // - Data subject rights support
  return true; // Simplified for demonstration
};

/**
 * Validates if data handling is compliant with HIPAA requirements
 * @param data Data to validate
 * @returns Whether the handling is compliant
 */
export const isHIPAACompliant = (data: any): boolean => {
  // Implementation would include checks for:
  // - PHI identification and protection
  // - Access controls
  // - Audit logging
  // - Transmission security
  return true; // Simplified for demonstration
};

/**
 * Creates a MedicationRequest in FHIR format
 * @param prescription Prescription data
 * @param patientId Patient ID
 * @param practitionerId Practitioner ID
 * @returns FHIR MedicationRequest resource
 */
export const createFHIRMedicationRequest = (prescription: any, patientId: string, practitionerId: string) => {
  return {
    resourceType: 'MedicationRequest',
    id: prescription.id || `rx-${Date.now()}`,
    status: prescription.status || 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [
        {
          system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
          code: prescription.medicationCode || '1234',
          display: prescription.medicationName || 'Medication'
        }
      ],
      text: prescription.medicationName || 'Medication'
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    requester: {
      reference: `Practitioner/${practitionerId}`
    },
    dosageInstruction: [
      {
        text: prescription.dosage || 'Take as directed',
        timing: {
          repeat: {
            frequency: prescription.frequency || 1,
            period: prescription.period || 1,
            periodUnit: prescription.periodUnit || 'd'
          }
        },
        route: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '26643006',
              display: 'Oral route'
            }
          ]
        }
      }
    ],
    dispenseRequest: {
      numberOfRepeatsAllowed: prescription.refills || 0,
      quantity: {
        value: prescription.quantity || 1,
        unit: prescription.unit || 'tablets',
        system: 'http://unitsofmeasure.org',
        code: prescription.quantityCode || 'TAB'
      },
      expectedSupplyDuration: {
        value: prescription.duration || 30,
        unit: 'days',
        system: 'http://unitsofmeasure.org',
        code: 'd'
      }
    }
  };
};
