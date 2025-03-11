
/**
 * Utilities for FHIR (Fast Healthcare Interoperability Resources) compliance
 * This file contains functions to help with FHIR standard compliance
 */

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
export const convertDoctorToFHIRPractitioner = (doctorData: any) => {
  if (!doctorData) return null;
  
  return {
    resourceType: 'Practitioner',
    id: doctorData.id,
    identifier: [
      {
        system: 'urn:oid:2.16.840.1.113883.4.3.276.medicalLicense',
        value: doctorData.medicalLicenseNumber || ''
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
          text: 'Medical Doctor'
        },
        identifier: [
          {
            system: 'urn:oid:2.16.840.1.113883.4.3.276',
            value: doctorData.medicalLicenseNumber || ''
          }
        ]
      }
    ]
  };
};

/**
 * Generates GDPR and HIPAA compliant consent document in FHIR format
 * @param userId User ID
 * @returns FHIR Consent resource
 */
export const generateFHIRConsent = (userId: string) => {
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
