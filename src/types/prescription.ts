
export interface PrescriptionRequest {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  dateSubmitted: string;
  symptoms: string;
  questionnaire: {
    pain: string;
    sleep: string;
    anxiety: string;
    previous_treatment: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'needs_more_info';
  doctorNotes?: string;
  cartItems?: PrescriptionCartItem[];
  assignedDoctorId?: string;
  prescription?: {
    id: string;
    product: string;
    dosage: string;
    duration: string;
    instructions: string;
    dateIssued: string;
    expiryDate: string;
    signature?: {
      doctorName: string;
      dateSigned: string;
      signatureImage?: string;
    };
  };
}

export interface PrescriptionCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
