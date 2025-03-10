
import { Patient } from "@/types/patient";

// Beispieldaten für Patienten
export const patients: Patient[] = [
  {
    id: "p1",
    name: "Max Mustermann",
    email: "max.mustermann@example.com",
    phone: "+49 123 4567890",
    dateOfBirth: "1985-05-15",
    gender: "male",
    address: {
      street: "Musterstraße 123",
      city: "Berlin",
      zipCode: "10115",
      country: "Deutschland"
    },
    insuranceProvider: "TK",
    insuranceNumber: "A123456789",
    medicalHistory: [
      {
        id: "mh1",
        date: "2023-09-10",
        diagnosis: "Milde Rückenschmerzen",
        treatment: "Physiotherapie, Schmerzmittel",
        notes: "Patient berichtet über chronische Schmerzen nach langem Sitzen",
        doctorId: "d1"
      }
    ],
    allergies: ["Pollen", "Penicillin"],
    medications: [
      {
        id: "med1",
        name: "Ibuprofen",
        dosage: "400mg",
        frequency: "3x täglich",
        startDate: "2023-09-10",
        isActive: true,
        prescribedBy: "d1"
      }
    ],
    notes: "Patient arbeitet im Büro und hat sitzenden Lebensstil",
    lastVisit: "2023-09-10",
    createdAt: "2022-03-15"
  },
  {
    id: "p2",
    name: "Anna Schmidt",
    email: "anna.schmidt@example.com",
    phone: "+49 987 6543210",
    dateOfBirth: "1990-12-03",
    gender: "female",
    address: {
      street: "Hauptstraße 42",
      city: "München",
      zipCode: "80331",
      country: "Deutschland"
    },
    insuranceProvider: "AOK",
    insuranceNumber: "B987654321",
    medicalHistory: [
      {
        id: "mh2",
        date: "2023-10-05",
        diagnosis: "Migräne",
        treatment: "Sumatriptan",
        notes: "Attacken ca. 2x monatlich",
        doctorId: "d1"
      }
    ],
    allergies: ["Nüsse"],
    medications: [
      {
        id: "med2",
        name: "Sumatriptan",
        dosage: "50mg",
        frequency: "Bei Bedarf (max. 2 Tabletten/Tag)",
        startDate: "2023-10-05",
        isActive: true,
        prescribedBy: "d1"
      }
    ],
    lastVisit: "2023-10-05",
    createdAt: "2022-06-20"
  },
  {
    id: "p3",
    name: "Thomas Weber",
    email: "thomas.weber@example.com",
    phone: "+49 159 7531598",
    dateOfBirth: "1975-08-22",
    gender: "male",
    address: {
      street: "Parkweg 15",
      city: "Hamburg",
      zipCode: "20095",
      country: "Deutschland"
    },
    insuranceProvider: "Barmer",
    insuranceNumber: "C456123789",
    medicalHistory: [
      {
        id: "mh3",
        date: "2023-07-18",
        diagnosis: "Arthrose im rechten Knie",
        treatment: "Physikalische Therapie, Schmerzmanagement",
        doctorId: "d1"
      }
    ],
    allergies: ["Sulfonamide"],
    medications: [
      {
        id: "med3",
        name: "Diclofenac",
        dosage: "75mg",
        frequency: "2x täglich",
        startDate: "2023-07-18",
        isActive: true,
        prescribedBy: "d1"
      }
    ],
    notes: "Patient ist leidenschaftlicher Jogger",
    lastVisit: "2023-11-05",
    createdAt: "2021-09-12"
  }
];

// Funktion, um Patienten abzurufen
export const getPatients = async (): Promise<Patient[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(patients);
    }, 500); // Simuliere Netzwerklatenz
  });
};

// Funktion, um einen Patienten nach ID abzurufen
export const getPatientById = async (id: string): Promise<Patient | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const patient = patients.find(p => p.id === id);
      resolve(patient);
    }, 300);
  });
};
