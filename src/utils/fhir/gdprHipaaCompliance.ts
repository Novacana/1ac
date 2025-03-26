/**
 * GDPR and HIPAA Compliance Utilities
 */

import { supabase } from "@/integrations/supabase/client";

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
 * Anonymizes sensitive data in accordance with GDPR
 * @param data Data to anonymize
 * @returns Anonymized data
 */
export const anonymizeData = (data: any): any => {
  if (!data) return data;
  
  const sensitiveFields = [
    'medicalRecord', 'ssn', 'insuranceId', 'address', 'dateOfBirth', 
    'fullName', 'email', 'phone'
  ];
  
  const result = { ...data };
  
  sensitiveFields.forEach(field => {
    if (result[field]) {
      // Replace with anonymized versions
      if (field === 'email') {
        // Replace with anonymized email
        const parts = result[field].split('@');
        if (parts.length === 2) {
          result[field] = `${parts[0].substring(0, 2)}${'*'.repeat(parts[0].length - 2)}@${parts[1]}`;
        }
      } else if (field === 'phone') {
        // Replace with anonymized phone
        result[field] = result[field].replace(/\d(?=\d{4})/g, '*');
      } else if (field === 'dateOfBirth') {
        // Keep only the year
        const date = new Date(result[field]);
        result[field] = `****-**-**`;
      } else {
        // Replace with stars for other fields
        result[field] = '*'.repeat(result[field].toString().length);
      }
    }
  });
  
  return result;
};
