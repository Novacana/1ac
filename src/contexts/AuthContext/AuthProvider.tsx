
import React, { useState, useEffect } from 'react';
import AuthContext from './context';
import { migrateUserData } from './migration';
import { updateUserAddresses, updateUserPaymentMethods, updateUserDocuments } from './userManagement';
import { getDoctorDemoUser, getPharmacyDemoUser, getPatientDemoUser } from './demoUsers';
import { User, Address, PaymentMethod } from '@/types/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('doctor_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(migrateUserData(parsedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }, []);
  
  const isAuthenticated = user !== null;
  const isDoctor = isAuthenticated && user.role === 'doctor';
  const isAdmin = isAuthenticated && user.role === 'admin';
  const isPharmacy = isAuthenticated && user.role === 'pharmacy';
  
  const login = async (email: string, password: string) => {
    if (email === 'doctor@example.com' && password === 'password') {
      const demoUser = getDoctorDemoUser();
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else if (email === 'pharmacy@example.com' && password === 'password') {
      const demoUser = getPharmacyDemoUser();
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else if (email === 'user@example.com' && password === 'password') {
      const demoUser = getPatientDemoUser();
      setUser(demoUser);
      localStorage.setItem('doctor_user', JSON.stringify(demoUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'doctor' | 'pharmacy' = 'user') => {
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      role,
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
      const updatedUser = updateUserAddresses(user, 'add', address);
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const updateAddress = (address: Address) => {
    if (user) {
      const updatedUser = updateUserAddresses(user, 'update', address);
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const removeAddress = (addressId: string) => {
    if (user) {
      const updatedUser = updateUserAddresses(user, 'remove', addressId);
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const setDefaultAddress = (addressId: string) => {
    if (user) {
      const updatedUser = updateUserAddresses(user, 'setDefault', addressId);
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const addPaymentMethod = (paymentMethod: Omit<PaymentMethod, 'id'>) => {
    if (user) {
      const updatedUser = updateUserPaymentMethods(user, 'add', paymentMethod);
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const updatePaymentMethod = (paymentMethod: PaymentMethod) => {
    if (user) {
      const updatedUser = updateUserPaymentMethods(user, 'update', paymentMethod);
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const removePaymentMethod = (paymentMethodId: string) => {
    if (user) {
      const updatedUser = updateUserPaymentMethods(user, 'remove', paymentMethodId);
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const setDefaultPaymentMethod = (paymentMethodId: string) => {
    if (user) {
      const updatedUser = updateUserPaymentMethods(user, 'setDefault', paymentMethodId);
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
    }
  };
  
  const uploadVerificationDocument = async (documentType: 'approbation' | 'pharmacy_license' | 'id_document', file: File) => {
    if (!user) return;
    
    console.log(`Uploading ${documentType} document: ${file.name}`);
    
    const updatedUser = updateUserDocuments(user, documentType);
    
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

export default AuthProvider;
