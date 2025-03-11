
export interface Address {
  id: string;
  street: string;
  city: string;
  zip: string;
  state: string;
  country: string;
  isDefault: boolean;
  additionalInfo?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal';
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  paypalEmail?: string;
  isDefault: boolean;
  cardHolder?: string;
  expiryDate?: string;
}

export interface Document {
  id: string;
  type: 'approbation' | 'pharmacy_license' | 'id_document';
  name: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: Date;
  uploadDate?: string; // Adding this for backward compatibility
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'doctor' | 'pharmacy' | 'admin';
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  identificationStatus: 'not_verified' | 'pending' | 'verified' | 'pending_review' | 'failed';
  verificationStatus?: 'not_verified' | 'pending' | 'verified' | 'pending_review';
  verificationDocuments: Document[];
  pharmacyLicenseNumber?: string;
  phone?: string;
  medicalLicenseNumber?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
  isPharmacy: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
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
