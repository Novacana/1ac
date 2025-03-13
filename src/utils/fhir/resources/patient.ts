
/**
 * FHIR Patient resource utilities
 */

import { User } from "@/types/auth";

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
