
import { User } from '@/types/auth';

export const getDoctorDemoUser = (): User => {
  return {
    id: '1',
    name: 'Dr. Schmidt',
    email: 'doctor@example.com',
    role: 'doctor',
    addresses: [
      {
        id: '1',
        street: 'Musterstraße 1',
        city: 'Berlin',
        state: 'Berlin',
        zip: '10115',
        country: 'Deutschland',
        isDefault: true
      }
    ],
    paymentMethods: [
      {
        id: '1',
        type: 'credit_card',
        cardNumber: '4321',
        expiryDate: '12/25',
        cardHolder: 'Dr. Schmidt',
        isDefault: true
      }
    ],
    phone: '+49 123 456789',
    identificationStatus: 'verified',
    verificationStatus: 'verified',
    medicalLicenseNumber: 'ARZTNR-12345',
    verificationDocuments: [
      {
        id: '1',
        type: 'approbation',
        status: 'approved',
        uploadDate: '2023-10-15'
      }
    ]
  };
};

export const getPharmacyDemoUser = (): User => {
  return {
    id: '3',
    name: 'Muster Apotheke',
    email: 'pharmacy@example.com',
    role: 'pharmacy',
    addresses: [
      {
        id: '1',
        street: 'Apothekenstraße 10',
        city: 'München',
        state: 'Bayern',
        zip: '80331',
        country: 'Deutschland',
        isDefault: true
      }
    ],
    paymentMethods: [],
    phone: '+49 123 987654',
    identificationStatus: 'verified',
    verificationStatus: 'verified',
    pharmacyLicenseNumber: 'APO-987654',
    verificationDocuments: [
      {
        id: '1',
        type: 'pharmacy_license',
        status: 'approved',
        uploadDate: '2023-09-20'
      }
    ]
  };
};

export const getPatientDemoUser = (): User => {
  return {
    id: '2',
    name: 'Max Mustermann',
    email: 'user@example.com',
    role: 'user',
    addresses: [
      {
        id: '1',
        street: 'Musterstraße 123',
        additionalInfo: 'Wohnung 4B',
        city: 'Berlin',
        state: 'Berlin',
        zip: '10115',
        country: 'Deutschland',
        isDefault: true
      }
    ],
    paymentMethods: [
      {
        id: '1',
        type: 'credit_card',
        cardNumber: '1234',
        expiryDate: '06/24',
        cardHolder: 'Max Mustermann',
        isDefault: true
      }
    ],
    phone: '+49 987 654321',
    identificationStatus: 'not_verified'
  };
};
