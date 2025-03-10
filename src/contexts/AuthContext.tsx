import React, { createContext, useContext, useState, useEffect } from 'react';

interface Address {
  id: string;
  street?: string;
  additionalInfo?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card';
  cardNumber: string; // Last 4 digits only
  expiryDate: string;
  cardHolder: string;
  isDefault: boolean;
}

interface User {
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

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('doctor_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      if (parsedUser.address && !parsedUser.addresses) {
        parsedUser.addresses = [
          {
            id: '1',
            ...parsedUser.address,
            isDefault: true
          }
        ];
        delete parsedUser.address;
      }
      
      if (!parsedUser.addresses) {
        parsedUser.addresses = [];
      }
      
      if (!parsedUser.paymentMethods) {
        parsedUser.paymentMethods = [];
      }
      
      if (!parsedUser.identificationStatus) {
        parsedUser.identificationStatus = 'not_verified';
      }
      
      if (!parsedUser.verificationStatus && 
          (parsedUser.role === 'doctor' || parsedUser.role === 'pharmacy')) {
        parsedUser.verificationStatus = 'not_verified';
      }
      
      if (!parsedUser.verificationDocuments) {
        parsedUser.verificationDocuments = [];
      }
      
      setUser(parsedUser);
    }
  }, []);
  
  const isAuthenticated = user !== null;
  const isDoctor = isAuthenticated && user.role === 'doctor';
  const isAdmin = isAuthenticated && user.role === 'admin';
  const isPharmacy = isAuthenticated && user.role === 'pharmacy';
  
  const login = async (email: string, password: string) => {
    if (email === 'doctor@example.com' && password === 'password') {
      const demoUser = {
        id: '1',
        name: 'Dr. Schmidt',
        email: 'doctor@example.com',
        role: 'doctor' as const,
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
            type: 'credit_card' as const,
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
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else if (email === 'pharmacy@example.com' && password === 'password') {
      const demoUser = {
        id: '3',
        name: 'Muster Apotheke',
        email: 'pharmacy@example.com',
        role: 'pharmacy' as const,
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
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else if (email === 'user@example.com' && password === 'password') {
      const demoUser = {
        id: '2',
        name: 'Max Mustermann',
        email: 'user@example.com',
        role: 'user' as const,
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
            type: 'credit_card' as const,
            cardNumber: '1234',
            expiryDate: '06/24',
            cardHolder: 'Max Mustermann',
            isDefault: true
          }
        ],
        phone: '+49 987 654321',
        identificationStatus: 'not_verified'
      };
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'doctor' | 'pharmacy' = 'user') => {
    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: role as 'user' | 'doctor' | 'pharmacy' | 'admin',
      addresses: [],
      paymentMethods: [],
      identificationStatus: 'not_verified',
      verificationStatus: role === 'user' ? undefined : 'not_verified',
      verificationDocuments: []
    };
    
    setUser(newUser);
    localStorage.setItem('doctor_user', JSON.stringify(newUser));
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const addAddress = (address: Omit<Address, 'id'>) => {
    if (user) {
      const newAddress = {
        ...address,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      const updatedAddresses = address.isDefault 
        ? user.addresses.map(addr => ({ ...addr, isDefault: false }))
        : [...user.addresses];
        
      updatedAddresses.push(newAddress);
      
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const updateAddress = (address: Address) => {
    if (user) {
      let updatedAddresses = user.addresses.map(addr => 
        addr.id === address.id 
          ? address 
          : address.isDefault ? { ...addr, isDefault: false } : addr
      );
      
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const removeAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      
      if (user.addresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const setDefaultAddress = (addressId: string) => {
    if (user) {
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      const updatedUser = { ...user, addresses: updatedAddresses };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const addPaymentMethod = (paymentMethod: Omit<PaymentMethod, 'id'>) => {
    if (user) {
      const newPaymentMethod = {
        ...paymentMethod,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      const updatedPaymentMethods = paymentMethod.isDefault 
        ? user.paymentMethods.map(pm => ({ ...pm, isDefault: false }))
        : [...user.paymentMethods];
        
      updatedPaymentMethods.push(newPaymentMethod);
      
      const updatedUser = { ...user, paymentMethods: updatedPaymentMethods };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const updatePaymentMethod = (paymentMethod: PaymentMethod) => {
    if (user) {
      let updatedPaymentMethods = user.paymentMethods.map(pm => 
        pm.id === paymentMethod.id 
          ? paymentMethod 
          : paymentMethod.isDefault ? { ...pm, isDefault: false } : pm
      );
      
      const updatedUser = { ...user, paymentMethods: updatedPaymentMethods };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const removePaymentMethod = (paymentMethodId: string) => {
    if (user) {
      const updatedPaymentMethods = user.paymentMethods.filter(pm => pm.id !== paymentMethodId);
      
      if (user.paymentMethods.find(pm => pm.id === paymentMethodId)?.isDefault && updatedPaymentMethods.length > 0) {
        updatedPaymentMethods[0].isDefault = true;
      }
      
      const updatedUser = { ...user, paymentMethods: updatedPaymentMethods };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const setDefaultPaymentMethod = (paymentMethodId: string) => {
    if (user) {
      const updatedPaymentMethods = user.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId
      }));
      
      const updatedUser = { ...user, paymentMethods: updatedPaymentMethods };
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const uploadVerificationDocument = async (documentType: 'approbation' | 'pharmacy_license' | 'id_document', file: File) => {
    if (!user) return;
    
    console.log(`Uploading ${documentType} document: ${file.name}`);
    
    const newDocument = {
      id: Math.random().toString(36).substring(2, 9),
      type: documentType,
      status: 'pending' as const,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedUser = { 
      ...user,
      verificationDocuments: [...(user.verificationDocuments || []), newDocument],
      verificationStatus: 'pending_review'
    };
    
    setUser(updatedUser);
    localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    
    return Promise.resolve();
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('doctor_user');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isDoctor, 
      isAdmin,
      isPharmacy,
      login, 
      logout,
      register,
      updateUserProfile,
      addAddress,
      updateAddress,
      removeAddress,
      setDefaultAddress,
      addPaymentMethod,
      updatePaymentMethod,
      removePaymentMethod,
      setDefaultPaymentMethod,
      uploadVerificationDocument
    }}>
      {children}
    </AuthContext.Provider>
  );
};

