
/**
 * FHIR Pharmacy Resource Utilities
 */

import { supabase } from "@/integrations/supabase/client";
import { PrescriptionCartItem } from "@/types/prescription";
import { toast } from "sonner";

/**
 * Schickt ein Rezept an die entsprechenden Apotheken
 * @param prescriptionData Verschreibungsdaten
 * @param cartItems Warenkorb-Artikel
 * @returns Erfolgsstatuts
 */
export const sendPrescriptionToPharmacies = async (
  prescriptionData: any,
  cartItems: PrescriptionCartItem[] = []
): Promise<{success: boolean, pharmacyIds: string[]}> => {
  try {
    // Gruppiere Produkte nach Apotheke (in echtem System basierend auf Produkt-Metadaten)
    // In dieser Demo nehmen wir an, dass alle Produkte von der gleichen Apotheke stammen
    const pharmacyId = "pharmacy-1"; // In der Praxis: würde aus Produkt-Metadaten abgeleitet
    
    // Erstelle FHIR-konforme Ressource
    const medicationDispense = {
      resourceType: "MedicationDispense",
      id: `dispense-${Date.now()}`,
      status: "preparation",
      medicationReference: {
        reference: `Medication/${prescriptionData.id}`,
        display: prescriptionData.product
      },
      subject: {
        reference: `Patient/${prescriptionData.patientId || 'unknown'}`,
        display: prescriptionData.patientName
      },
      performer: [
        {
          actor: {
            reference: `Organization/${pharmacyId}`,
            display: "Beispiel-Apotheke"
          }
        }
      ],
      authorizingPrescription: [
        {
          reference: `MedicationRequest/${prescriptionData.id}`
        }
      ],
      quantity: {
        value: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        unit: "Stück"
      },
      whenHandedOver: null, // Wird gesetzt, wenn Apotheke Medikament aushändigt
      dosageInstruction: [
        {
          text: prescriptionData.instructions || "Gemäß ärztlicher Anweisung"
        }
      ],
      // GDPR-konforme Metadaten
      meta: {
        security: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-Confidentiality",
            code: "R",
            display: "Restricted"
          }
        ],
        tag: [
          {
            system: "http://terminology.hl7.org/CodeSystem/common-tags",
            code: "GDPR",
            display: "GDPR Compliant"
          },
          {
            system: "http://terminology.hl7.org/CodeSystem/common-tags",
            code: "HIPAA",
            display: "HIPAA Compliant"
          }
        ]
      }
    };
    
    // Protokolliere die Aktion für GDPR/HIPAA-Compliance
    await supabase.from('gdpr_logs').insert({
      user_id: prescriptionData.doctorId || 'unknown',
      action_type: 'prescription_pharmacy_send',
      description: `Rezept an Apotheke gesendet für Patient ${prescriptionData.patientName}`,
      metadata: {
        prescription_id: prescriptionData.id,
        pharmacy_id: pharmacyId,
        patient_id: prescriptionData.patientId || 'unknown',
        fhir_resource: "MedicationDispense",
        products: cartItems.map(item => item.name).join(', ')
      }
    });
    
    console.log("FHIR MedicationDispense an Apotheke gesendet:", medicationDispense);
    
    // In einer echten Implementierung: API-Aufruf an Apotheken-System
    // await fetch('https://pharmacy-api.example.com/dispense', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/fhir+json' },
    //   body: JSON.stringify(medicationDispense)
    // });
    
    return { success: true, pharmacyIds: [pharmacyId] };
  } catch (error) {
    console.error("Fehler beim Senden des Rezepts an die Apotheke:", error);
    return { success: false, pharmacyIds: [] };
  }
};

/**
 * Erhalte eine Liste aller verfügbaren Apotheken
 * @returns Liste der Apotheken
 */
export const getAvailablePharmacies = async () => {
  // In einer echten Implementierung: Datenbankabfrage oder API-Aufruf
  return [
    { id: "pharmacy-1", name: "Beispiel-Apotheke", address: "Musterstraße 1, 12345 Berlin" },
    { id: "pharmacy-2", name: "Cannabis-Apotheke", address: "Hanfweg 42, 10115 Berlin" }
  ];
};
