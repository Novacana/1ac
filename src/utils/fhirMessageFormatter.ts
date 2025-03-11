
/**
 * FHIR Message Formatter Utility
 * 
 * This utility helps format messages to comply with the FHIR (Fast Healthcare Interoperability Resources) standard
 * which is required for healthcare data exchange according to HIPAA regulations.
 */

// Basic FHIR Resource structure for a chat message
interface FHIRCommunicationResource {
  resourceType: "Communication";
  status: "in-progress" | "completed" | "unknown";
  sent: string; // ISO timestamp
  received?: string; // ISO timestamp for received messages
  payload: {
    contentString: string;
  }[];
  sender?: {
    reference: string;
  };
  recipient?: {
    reference: string;
  };
}

/**
 * Formats a chat message to comply with FHIR standards
 */
export const formatMessageAsFHIR = (
  message: string,
  role: "user" | "assistant" | "system",
  timestamp: string = new Date().toISOString()
): FHIRCommunicationResource => {
  const resource: FHIRCommunicationResource = {
    resourceType: "Communication",
    status: "completed",
    sent: timestamp,
    payload: [
      {
        contentString: message,
      },
    ],
  };

  // Set sender and recipient based on role
  if (role === "user") {
    resource.sender = {
      reference: "Patient/user",
    };
    resource.recipient = {
      reference: "Device/chatbot",
    };
  } else if (role === "assistant") {
    resource.sender = {
      reference: "Device/chatbot",
    };
    resource.recipient = {
      reference: "Patient/user",
    };
    resource.received = timestamp;
  } else {
    // System messages
    resource.sender = {
      reference: "Device/system",
    };
    resource.recipient = {
      reference: "Patient/user",
    };
  }

  return resource;
};

/**
 * Sanitizes potential PHI (Protected Health Information) from messages 
 * to maintain HIPAA compliance
 */
export const sanitizeProtectedHealthInfo = (message: string): string => {
  // Basic pattern matching for potential PHI
  // This is a simplified example - real implementations would be more sophisticated
  const patterns = [
    /\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, // SSN
    /\b\d{9}\b/g, // 9-digit numbers that could be SSN without separators
    /\b[A-Z]{2}\d{6,8}\b/g, // Potential medical record numbers
  ];

  let sanitizedMessage = message;
  
  // Replace potential PHI with [REDACTED]
  patterns.forEach(pattern => {
    sanitizedMessage = sanitizedMessage.replace(pattern, "[REDACTED]");
  });

  return sanitizedMessage;
};

/**
 * Prepares a message for sending to external systems, ensuring FHIR 
 * and HIPAA compliance
 */
export const prepareCompliantMessage = (
  message: string, 
  role: "user" | "assistant" | "system",
  sessionId: string
): { 
  message: string; 
  fhirResource: FHIRCommunicationResource;
  timestamp: string;
  sessionId: string;
} => {
  const timestamp = new Date().toISOString();
  const sanitizedMessage = sanitizeProtectedHealthInfo(message);
  const fhirResource = formatMessageAsFHIR(sanitizedMessage, role, timestamp);
  
  return {
    message: sanitizedMessage,
    fhirResource,
    timestamp,
    sessionId
  };
};
