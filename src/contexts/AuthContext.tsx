
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
  role: 'doctor' | 'admin' | 'user' | 'pharmacy';
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isAdmin: boolean;
  isPharmacy: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (paymentMethod: PaymentMethod) => void;
  removePaymentMethod: (paymentMethodId: string) => void;
  setDefaultPaymentMethod: (paymentMethodId: string) => void;
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
  
  // Simulated authentication - replace with real authentication in production
  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('doctor_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Convert old user data format to new format if needed
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
      
      setUser(parsedUser);
    }
  }, []);
  
  // Determine user roles
  const isAuthenticated = user !== null;
  const isDoctor = isAuthenticated && user.role === 'doctor';
  const isAdmin = isAuthenticated && user.role === 'admin';
  const isPharmacy = isAuthenticated && user.role === 'pharmacy';
  
  const login = async (email: string, password: string) => {
    // Simulation - in production, this would be a real API call
    // Demo user for development - in production, validate credentials on server
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
        phone: '+49 123 456789'
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
        phone: '+49 987 654321'
      };
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else if (email === 'pharmacy@example.com' && password === 'password') {
      const demoUser = {
        id: '3',
        name: 'Apotheke am Hauptplatz',
        email: 'pharmacy@example.com',
        role: 'pharmacy' as const,
        addresses: [
          {
            id: '1',
            street: 'Hauptplatz 5',
            city: 'Berlin',
            state: 'Berlin',
            zip: '10115',
            country: 'Deutschland',
            isDefault: true
          }
        ],
        paymentMethods: [],
        phone: '+49 123 456700'
      };
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulation - in production, this would be a real API call
    const newUser = {
      id: Math.random().toString(36).substring(2, 9), // Generate random ID
      name,
      email,
      role: 'user' as const,
      addresses: [],
      paymentMethods: []
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
      
      // If this is the first address or set as default, make sure it's the only default
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
      // If setting as default, update all other addresses
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
      
      // If we removed the default address and have other addresses, set a new default
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
      
      // If this is the first payment method or set as default, make sure it's the only default
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
      // If setting as default, update all other payment methods
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
      
      // If we removed the default payment method and have others, set a new default
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
      setDefaultPaymentMethod
    }}>
      {children}
    </AuthContext.Provider>
  );
};
