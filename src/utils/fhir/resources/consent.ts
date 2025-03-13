
/**
 * FHIR Consent resource utilities
 */

import { supabase } from "@/integrations/supabase/client";

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
