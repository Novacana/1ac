
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'diverse';
  address?: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  insuranceProvider?: string;
  insuranceNumber?: string;
  medicalHistory?: MedicalHistoryEntry[];
  allergies?: string[];
  medications?: Medication[];
  notes?: string;
  lastVisit?: string;
  createdAt: string;
}

export interface MedicalHistoryEntry {
  id: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  doctorId: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  prescribedBy: string;
}
