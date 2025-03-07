
import { PrescriptionRequest } from "@/types/prescription";

// Simulierte Daten für Rezeptanfragen
export const prescriptionRequests: PrescriptionRequest[] = [
  {
    id: "req-001",
    patientName: "Max Mustermann",
    patientEmail: "max.mustermann@example.com",
    patientPhone: "+49 123 456789",
    dateSubmitted: "2023-07-15T10:30:00Z",
    symptoms: "Ich leide seit 4 Jahren unter chronischen Rückenschmerzen nach einem Autounfall. Bisher haben konventionelle Schmerzmittel nur begrenzt geholfen.",
    questionnaire: {
      pain: "yes",
      sleep: "yes",
      anxiety: "no",
      previous_treatment: "yes"
    },
    status: "pending"
  },
  {
    id: "req-002",
    patientName: "Anna Schmidt",
    patientEmail: "anna.schmidt@example.com",
    patientPhone: "+49 987 654321",
    dateSubmitted: "2023-07-14T14:45:00Z",
    symptoms: "Schlafstörungen und Angstzustände seit etwa 6 Monaten. Habe bereits verschiedene Medikamente ohne Erfolg ausprobiert.",
    questionnaire: {
      pain: "no",
      sleep: "yes",
      anxiety: "yes",
      previous_treatment: "yes"
    },
    status: "approved",
    doctorNotes: "Patientin hat bereits mehrere Behandlungsoptionen versucht. Cannabis könnte eine gute Alternative sein.",
    prescription: {
      id: "presc-002",
      product: "CBD-Öl 5%",
      dosage: "10mg, 2x täglich",
      duration: "3 Monate",
      instructions: "5 Tropfen morgens und abends unter die Zunge",
      dateIssued: "2023-07-15T09:20:00Z",
      expiryDate: "2023-10-15T09:20:00Z"
    }
  },
  {
    id: "req-003",
    patientName: "Klaus Weber",
    patientEmail: "klaus.weber@example.com",
    patientPhone: "+49 555 123456",
    dateSubmitted: "2023-07-13T08:15:00Z",
    symptoms: "Chronische Arthritis-Schmerzen in beiden Händen, die mir das Arbeiten erschweren. Bisherige Therapien haben Nebenwirkungen verursacht.",
    questionnaire: {
      pain: "yes",
      sleep: "yes",
      anxiety: "no",
      previous_treatment: "yes"
    },
    status: "needs_more_info",
    doctorNotes: "Bitte detailliertere Informationen zu bisherigen Behandlungen und Nebenwirkungen anfordern."
  },
  {
    id: "req-004",
    patientName: "Maria Becker",
    patientEmail: "maria.becker@example.com",
    patientPhone: "+49 333 789012",
    dateSubmitted: "2023-07-12T16:20:00Z",
    symptoms: "Multiple Sklerose mit spastischen Symptomen. Aktuell verschriebene Medikamente verursachen starke Müdigkeit.",
    questionnaire: {
      pain: "yes",
      sleep: "no",
      anxiety: "yes",
      previous_treatment: "yes"
    },
    status: "rejected",
    doctorNotes: "Aktuelle Medikation sollte weitergeführt werden. Alternative Behandlungsoptionen wurden in der Sprechstunde besprochen."
  },
  {
    id: "req-005",
    patientName: "Thomas Fischer",
    patientEmail: "thomas.fischer@example.com",
    patientPhone: "+49 444 567890",
    dateSubmitted: "2023-07-10T11:10:00Z",
    symptoms: "Starke Migräneattacken, mehrmals pro Woche. Habe bereits mehrere Triptane probiert, die entweder nicht wirken oder starke Nebenwirkungen haben.",
    questionnaire: {
      pain: "yes",
      sleep: "yes",
      anxiety: "no",
      previous_treatment: "yes"
    },
    status: "pending"
  }
];

// Service-Funktionen zum Abrufen und Aktualisieren der Daten
// In der Produktion würde dies durch API-Aufrufe ersetzt werden

export function getPrescriptionRequests(): Promise<PrescriptionRequest[]> {
  // Simulation einer API-Anfrage
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(prescriptionRequests);
    }, 500);
  });
}

export function getPrescriptionRequestById(id: string): Promise<PrescriptionRequest | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const request = prescriptionRequests.find(req => req.id === id);
      resolve(request);
    }, 300);
  });
}

export function updatePrescriptionRequest(
  id: string, 
  updates: Partial<PrescriptionRequest>
): Promise<PrescriptionRequest> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = prescriptionRequests.findIndex(req => req.id === id);
      if (index === -1) {
        reject(new Error("Rezeptanfrage nicht gefunden"));
        return;
      }
      
      prescriptionRequests[index] = {
        ...prescriptionRequests[index],
        ...updates
      };
      
      resolve(prescriptionRequests[index]);
    }, 400);
  });
}
