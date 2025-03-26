
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
    status: "pending",
    cartItems: [
      {
        id: "prod-001",
        name: "CBD Öl 5%",
        price: 49.99,
        quantity: 1,
        image: "/lovable-uploads/5ab221cf-6167-4c7a-9c6f-3ba8f9f37d5d.png"
      },
      {
        id: "prod-002",
        name: "THC Tropfen 10mg",
        price: 39.99,
        quantity: 2,
        image: "/lovable-uploads/2e4972d1-cad4-4080-8445-33fcfdee5f57.png"
      }
    ]
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
    assignedDoctorId: "d1",
    cartItems: [
      {
        id: "prod-003",
        name: "CBD-Öl 5%",
        price: 49.99,
        quantity: 1,
        image: "/lovable-uploads/5ab221cf-6167-4c7a-9c6f-3ba8f9f37d5d.png"
      }
    ],
    prescription: {
      id: "presc-002",
      product: "CBD-Öl 5%",
      dosage: "10mg, 2x täglich",
      duration: "3 Monate",
      instructions: "5 Tropfen morgens und abends unter die Zunge",
      dateIssued: "2023-07-15T09:20:00Z",
      expiryDate: "2023-10-15T09:20:00Z",
      signature: {
        doctorName: "Dr. Müller",
        dateSigned: "2023-07-15T09:20:00Z"
      }
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
    doctorNotes: "Bitte detailliertere Informationen zu bisherigen Behandlungen und Nebenwirkungen anfordern.",
    assignedDoctorId: "d1"
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
    doctorNotes: "Aktuelle Medikation sollte weitergeführt werden. Alternative Behandlungsoptionen wurden in der Sprechstunde besprochen.",
    assignedDoctorId: "d1"
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
  },
  {
    id: "req-006",
    patientName: "Julia König",
    patientEmail: "julia.koenig@example.com",
    patientPhone: "+49 777 123987",
    dateSubmitted: "2023-07-09T14:25:00Z",
    symptoms: "Chronische Schlaflosigkeit seit über einem Jahr. Herkömmliche Schlafmittel führen zu starker Benommenheit am nächsten Tag.",
    questionnaire: {
      pain: "no",
      sleep: "yes",
      anxiety: "yes",
      previous_treatment: "yes"
    },
    status: "pending"
  },
  {
    id: "req-007",
    patientName: "Markus Bauer",
    patientEmail: "markus.bauer@example.com",
    patientPhone: "+49 666 987654",
    dateSubmitted: "2023-07-08T09:15:00Z",
    symptoms: "ADHS-Symptome im Erwachsenenalter. Bisherige Stimulanzien verursachen Appetitlosigkeit und Gewichtsverlust.",
    questionnaire: {
      pain: "no",
      sleep: "yes",
      anxiety: "yes",
      previous_treatment: "yes"
    },
    status: "pending"
  }
];
