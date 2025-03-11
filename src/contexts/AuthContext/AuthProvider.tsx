
import React from 'react';
import AuthContext from './context';
import { User } from '@/types/auth';
import { useAuthActions } from './hooks/useAuthActions';
import { useProfileOperations } from './hooks/useProfileOperations';
import { usePaymentOperations } from './hooks/usePaymentOperations';
import { useVerificationOperations } from './hooks/useVerificationOperations';
import { useSessionState } from './hooks/useSessionState';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize the session state
  const { user, setUser, loading } = useSessionState((userId) => authActions.loadUserData(userId));
  
  // Initialize all the action hooks
  const authActions = useAuthActions(user, setUser);
  const profileOperations = useProfileOperations(user, setUser);
  const paymentOperations = usePaymentOperations(user, setUser);
  const verificationOperations = useVerificationOperations(user, setUser);
  
  // Computed properties
  const isAuthenticated = user !== null;
  const isDoctor = isAuthenticated && user?.role === 'doctor';
  const isAdmin = isAuthenticated && user?.role === 'admin';
  const isPharmacy = isAuthenticated && user?.role === 'pharmacy';
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isDoctor, 
      isAdmin,
      isPharmacy,
      login: authActions.login,
      loginWithGoogle: authActions.loginWithGoogle,
      logout: authActions.logout,
      register: authActions.register,
      updateUserProfile: profileOperations.updateUserProfile,
      addAddress: profileOperations.addAddress,
      updateAddress: profileOperations.updateAddress,
      removeAddress: profileOperations.removeAddress,
      setDefaultAddress: profileOperations.setDefaultAddress,
      addPaymentMethod: paymentOperations.addPaymentMethod,
      updatePaymentMethod: paymentOperations.updatePaymentMethod,
      removePaymentMethod: paymentOperations.removePaymentMethod,
      setDefaultPaymentMethod: paymentOperations.setDefaultPaymentMethod,
      uploadVerificationDocument: verificationOperations.uploadVerificationDocument
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
