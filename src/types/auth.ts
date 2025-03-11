
export interface Address {
  id: string;
  street?: string;
  additionalInfo?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card';
  cardNumber: string; // Last 4 digits only
  expiryDate: string;
  cardHolder: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'doctor' | 'pharmacy' | 'admin' | 'user';
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  phone?: string;
  identificationStatus?: 'not_verified' | 'pending_review' | 'verified' | 'failed';
  verificationStatus?: 'not_verified' | 'pending_review' | 'verified' | 'failed';
  verificationDocuments?: {
    id: string;
    type: 'approbation' | 'pharmacy_license' | 'id_document';
    status: 'pending' | 'approved' | 'rejected';
    uploadDate: string;
  }[];
  medicalLicenseNumber?: string;
  pharmacyLicenseNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
  isPharmacy: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: 'user' | 'doctor' | 'pharmacy') => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (paymentMethod: PaymentMethod) => void;
  removePaymentMethod: (paymentMethodId: string) => void;
  setDefaultPaymentMethod: (paymentMethodId: string) => void;
  uploadVerificationDocument: (documentType: 'approbation' | 'pharmacy_license' | 'id_document', file: File) => Promise<void>;
}
