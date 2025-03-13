
/**
 * FHIR MedicationRequest resource utilities
 */

/**
 * Creates a MedicationRequest in FHIR format
 * @param prescription Prescription data
 * @param patientId Patient ID
 * @param practitionerId Practitioner ID
 * @returns FHIR MedicationRequest resource
 */
export const createFHIRMedicationRequest = (prescription: any, patientId: string, practitionerId: string) => {
  return {
    resourceType: 'MedicationRequest',
    id: prescription.id || `rx-${Date.now()}`,
    status: prescription.status || 'active',
    intent: 'order',
    medicationCodeableConcept: {
      coding: [
        {
          system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
          code: prescription.medicationCode || '1234',
          display: prescription.medicationName || 'Medication'
        }
      ],
      text: prescription.medicationName || 'Medication'
    },
    subject: {
      reference: `Patient/${patientId}`
    },
    requester: {
      reference: `Practitioner/${practitionerId}`
    },
    dosageInstruction: [
      {
        text: prescription.dosage || 'Take as directed',
        timing: {
          repeat: {
            frequency: prescription.frequency || 1,
            period: prescription.period || 1,
            periodUnit: prescription.periodUnit || 'd'
          }
        },
        route: {
          coding: [
            {
              system: 'http://snomed.info/sct',
              code: '26643006',
              display: 'Oral route'
            }
          ]
        }
      }
    ],
    dispenseRequest: {
      numberOfRepeatsAllowed: prescription.refills || 0,
      quantity: {
        value: prescription.quantity || 1,
        unit: prescription.unit || 'tablets',
        system: 'http://unitsofmeasure.org',
        code: prescription.quantityCode || 'TAB'
      },
      expectedSupplyDuration: {
        value: prescription.duration || 30,
        unit: 'days',
        system: 'http://unitsofmeasure.org',
        code: 'd'
      }
    }
  };
};
