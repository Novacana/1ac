
/**
 * FHIR MedicationRequest Resource Utilities
 */

import { supabase } from "@/integrations/supabase/client";

/**
 * Converts a prescription request to a FHIR MedicationRequest resource
 * @param prescriptionData Prescription data
 * @returns FHIR MedicationRequest resource
 */
export const convertToFHIRMedicationRequest = (prescriptionData: any) => {
  // Create FHIR-compliant MedicationRequest resource
  const medicationRequest = {
    resourceType: "MedicationRequest",
    id: prescriptionData.id,
    status: prescriptionData.status === "approved" ? "active" : 
            prescriptionData.status === "rejected" ? "cancelled" : 
            prescriptionData.status === "pending" ? "draft" : "unknown",
    intent: "order",
    medicationCodeableConcept: {
      coding: [
        {
          system: "http://www.nlm.nih.gov/research/umls/rxnorm",
          code: prescriptionData.medicationCode || "unknown",
          display: prescriptionData.medicationName
        }
      ],
      text: prescriptionData.medicationName
    },
    subject: {
      reference: `Patient/${prescriptionData.patientId}`,
      display: prescriptionData.patientName
    },
    requester: {
      reference: `Practitioner/${prescriptionData.requesterId}`,
      display: prescriptionData.requesterName
    },
    recorder: prescriptionData.assignedDoctorId ? {
      reference: `Practitioner/${prescriptionData.assignedDoctorId}`,
      display: prescriptionData.assignedDoctorName
    } : undefined,
    reasonCode: [
      {
        text: prescriptionData.reason || "Unknown reason"
      }
    ],
    dosageInstruction: [
      {
        text: prescriptionData.dosage || "As directed",
        timing: {
          repeat: {
            frequency: prescriptionData.frequency || 1,
            period: prescriptionData.periodValue || 1,
            periodUnit: prescriptionData.periodUnit || "d"
          }
        },
        route: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "26643006",
              display: prescriptionData.route || "Oral route"
            }
          ]
        },
        doseAndRate: [
          {
            doseQuantity: {
              value: prescriptionData.doseValue || 1,
              unit: prescriptionData.doseUnit || "tablet",
              system: "http://unitsofmeasure.org",
              code: prescriptionData.doseUnitCode || "TAB"
            }
          }
        ]
      }
    ],
    dispenseRequest: {
      numberOfRepeatsAllowed: prescriptionData.repeats || 0,
      quantity: {
        value: prescriptionData.quantity || 1,
        unit: prescriptionData.quantityUnit || "tablet",
        system: "http://unitsofmeasure.org",
        code: prescriptionData.quantityUnitCode || "TAB"
      },
      expectedSupplyDuration: {
        value: prescriptionData.supplyDuration || 30,
        unit: "days",
        system: "http://unitsofmeasure.org",
        code: "d"
      }
    }
  };

  return medicationRequest;
};

/**
 * Records a medication request and logs it for GDPR compliance
 * @param userId User ID of the requester
 * @param prescriptionData Prescription data
 * @returns success status
 */
export const recordMedicationRequest = async (
  userId: string,
  prescriptionData: any
) => {
  try {
    // Log the medication request action
    await supabase.from('gdpr_logs').insert({
      user_id: userId,
      action_type: 'medication_request',
      description: `User submitted prescription request for ${prescriptionData.medicationName}`,
      metadata: {
        prescription_id: prescriptionData.id,
        medication_name: prescriptionData.medicationName,
        patient_id: prescriptionData.patientId
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error recording medication request:", error);
    return false;
  }
};
