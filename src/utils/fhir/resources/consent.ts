
/**
 * FHIR Consent Resource Utilities
 */

import { User } from "@/types/auth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Creates a FHIR Consent resource
 * @param patientId Patient ID
 * @param consentType Type of consent (e.g., "data-processing", "research", "treatment")
 * @param status Consent status ("active", "inactive", "entered-in-error", "proposed", "rejected")
 * @param provision Provision details (e.g., what is being consented to)
 * @returns FHIR Consent resource
 */
export const createFHIRConsent = (
  patientId: string,
  consentType: string,
  status: "active" | "inactive" | "entered-in-error" | "proposed" | "rejected",
  provision: any
) => {
  // Generate a unique ID for the consent
  const consentId = crypto.randomUUID();
  
  // Get current date in ISO format
  const dateTime = new Date().toISOString();
  
  // Create FHIR-compliant Consent resource
  const consent = {
    resourceType: "Consent",
    id: consentId,
    status: status,
    scope: {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/consentscope",
          code: "patient-privacy",
          display: "Privacy"
        }
      ]
    },
    category: [
      {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/consentcategorycodes",
            code: consentType,
            display: consentType === "data-processing" ? "Data Processing" : 
                    consentType === "research" ? "Research" : "Treatment"
          }
        ]
      }
    ],
    patient: {
      reference: `Patient/${patientId}`
    },
    dateTime: dateTime,
    organization: [
      {
        reference: "Organization/healthcare-provider"
      }
    ],
    policy: [
      {
        authority: "https://gdpr-info.eu/",
        uri: "https://gdpr-info.eu/art-6-gdpr/"
      }
    ],
    provision: provision
  };
  
  return consent;
};

/**
 * Records GDPR consent given by a user
 * @param userId User ID
 * @param consentDetails Details of the consent given
 * @returns success status
 */
export const recordGDPRConsent = async (
  userId: string,
  consentDetails: Record<string, any>
) => {
  try {
    // Log the consent action in GDPR logs
    await supabase.from('gdpr_logs').insert({
      user_id: userId,
      action_type: 'consent_given',
      description: 'User provided GDPR consent',
      metadata: consentDetails
    });
    
    return true;
  } catch (error) {
    console.error("Error recording GDPR consent:", error);
    return false;
  }
};

/**
 * Records HIPAA consent given by a user
 * @param userId User ID
 * @param consentDetails Details of the consent given
 * @returns success status
 */
export const recordHIPAAConsent = async (
  userId: string,
  consentDetails: Record<string, any>
) => {
  try {
    // Log the consent action in GDPR logs
    await supabase.from('gdpr_logs').insert({
      user_id: userId,
      action_type: 'hipaa_consent_given',
      description: 'User provided HIPAA consent',
      metadata: consentDetails
    });
    
    return true;
  } catch (error) {
    console.error("Error recording HIPAA consent:", error);
    return false;
  }
};
