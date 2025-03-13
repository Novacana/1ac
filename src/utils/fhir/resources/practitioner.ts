
/**
 * FHIR Practitioner resource utilities
 */

import { supabase } from "@/integrations/supabase/client";

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
