
/**
 * FHIR DocumentReference Resource Utilities
 */

import { supabase } from "@/integrations/supabase/client";

interface DocumentData {
  id: string;
  name: string;
  type: string;
  status: string;
  contentType: string;
  url: string;
  size?: number;
}

/**
 * Creates a FHIR DocumentReference resource
 * @param patientId Patient ID
 * @param documentData Document data
 * @returns FHIR DocumentReference resource
 */
export const createFHIRDocumentReference = (
  patientId: string,
  documentData: DocumentData
) => {
  // Get current date in ISO format
  const dateTime = new Date().toISOString();
  
  // Create FHIR-compliant DocumentReference resource
  const documentReference = {
    resourceType: "DocumentReference",
    id: documentData.id,
    status: documentData.status === "verified" ? "current" :
            documentData.status === "rejected" ? "entered-in-error" : "preliminary",
    type: {
      coding: [
        {
          system: "http://loinc.org",
          code: documentData.type === "approbation" ? "51851-4" : 
                documentData.type === "pharmacy_license" ? "11369-6" : "67799-9",
          display: documentData.type
        }
      ]
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    date: dateTime,
    description: documentData.name,
    content: [
      {
        attachment: {
          contentType: documentData.contentType,
          url: documentData.url,
          size: documentData.size,
          title: documentData.name
        }
      }
    ],
    context: {
      related: [
        {
          reference: `Patient/${patientId}`
        }
      ]
    }
  };
  
  return documentReference;
};

/**
 * Records a document upload and logs it for GDPR compliance
 * @param userId User ID
 * @param documentData Document data
 * @returns success status
 */
export const recordDocumentUpload = async (
  userId: string,
  documentData: {
    id: string;
    name: string;
    type: string;
  }
) => {
  try {
    // Log the document upload action
    await supabase.from('gdpr_logs').insert({
      user_id: userId,
      action_type: 'document_upload',
      description: `User uploaded document: ${documentData.name}`,
      metadata: {
        document_id: documentData.id,
        document_name: documentData.name,
        document_type: documentData.type
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error recording document upload:", error);
    return false;
  }
};
