
/**
 * FHIR DocumentReference resource utilities
 */

/**
 * Creates a FHIR DocumentReference for a medical document
 * @param userId User ID
 * @param documentType Type of document
 * @param file File metadata
 * @param filePath Path to the stored file
 * @returns FHIR DocumentReference resource
 */
export const createFHIRDocumentReference = (
  userId: string,
  documentType: string,
  file: { name: string; type: string; size: number },
  filePath: string
) => {
  return {
    resourceType: "DocumentReference",
    status: "current",
    docStatus: "final",
    type: {
      coding: [{
        system: "http://loinc.org",
        code: documentType === 'approbation' ? "11488-4" : "11519-6",
        display: documentType === 'approbation' ? "Physician Note" : "Specialist Note"
      }]
    },
    subject: {
      reference: `Practitioner/${userId}`
    },
    date: new Date().toISOString(),
    securityLabel: [{
      coding: [{
        system: "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
        code: "R",
        display: "Restricted"
      }]
    }],
    content: [{
      attachment: {
        contentType: file.type,
        url: `${filePath}`,
        title: file.name,
        size: file.size
      }
    }]
  };
};
