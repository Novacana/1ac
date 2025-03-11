
import { useState } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getDoctorDemoUser, getPharmacyDemoUser, getPatientDemoUser } from '../demoUsers';
import { updateUserAddresses, updateUserPaymentMethods, updateUserDocuments } from '../userManagement';

export const useAuthActions = (user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  const [loading, setLoading] = useState(true);
  
  // Load user data from Supabase and synchronize with our user model
  const loadUserData = async (supabaseUserId: string) => {
    try {
      // Fetch user profile from our profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUserId)
        .single();
      
      if (profileError) throw profileError;
      
      // Fetch user addresses
      const { data: addressesData, error: addressesError } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', supabaseUserId);
      
      if (addressesError) throw addressesError;
      
      // Fetch payment methods
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', supabaseUserId);
      
      if (paymentsError) throw paymentsError;
      
      // Fetch verification documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', supabaseUserId);
      
      if (documentsError) throw documentsError;
      
      // Map database data to our User model
      const userProfile = mapUserDataFromDatabase(
        supabaseUserId, 
        profileData, 
        addressesData, 
        paymentsData, 
        documentsData
      );
      
      setUser(userProfile);
      localStorage.setItem('doctor_user', JSON.stringify(userProfile));
      return userProfile;
      
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };

  // Map database data to user object
  const mapUserDataFromDatabase = (
    userId: string,
    profileData: any,
    addressesData: any[],
    paymentsData: any[],
    documentsData: any[]
  ): User => {
    const mappedAddresses = addressesData.map((address: any) => ({
      id: address.id,
      street: address.street,
      city: address.city,
      zip: address.zip,
      state: address.state,
      country: address.country,
      isDefault: address.is_default,
      additionalInfo: address.additional_info
    }));
    
    const mappedPaymentMethods = paymentsData.map((payment: any) => ({
      id: payment.id,
      type: payment.type as 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal',
      isDefault: payment.is_default,
      ...(payment.card_number && { cardNumber: payment.card_number }),
      ...(payment.card_expiry && { cardExpiry: payment.card_expiry }),
      ...(payment.card_cvc && { cardCVC: payment.card_cvc }),
      ...(payment.bank_name && { bankName: payment.bank_name }),
      ...(payment.account_number && { accountNumber: payment.account_number }),
      ...(payment.routing_number && { routingNumber: payment.routing_number }),
      ...(payment.paypal_email && { paypalEmail: payment.paypal_email }),
      ...(payment.card_holder && { cardHolder: payment.card_holder }),
      ...(payment.expiry_date && { expiryDate: payment.expiry_date })
    }));
    
    const mappedDocuments = documentsData.map((doc: any) => ({
      id: doc.id,
      type: doc.type as 'approbation' | 'pharmacy_license' | 'id_document',
      name: doc.name,
      status: doc.status as 'pending' | 'verified' | 'rejected',
      uploadedAt: new Date(doc.uploaded_at),
      uploadDate: new Date(doc.uploaded_at).toISOString().split('T')[0]
    }));
    
    // Create our user object
    return {
      id: userId,
      name: profileData.name,
      email: profileData.email,
      role: profileData.role as 'user' | 'doctor' | 'pharmacy' | 'admin',
      addresses: mappedAddresses,
      paymentMethods: mappedPaymentMethods,
      identificationStatus: profileData.identification_status as 'not_verified' | 'pending' | 'verified' | 'pending_review' | 'failed',
      verificationStatus: profileData.verification_status as 'not_verified' | 'pending' | 'verified' | 'pending_review',
      verificationDocuments: mappedDocuments,
      phone: profileData.phone,
      ...(profileData.pharmacy_license_number && { pharmacyLicenseNumber: profileData.pharmacy_license_number }),
      ...(profileData.medical_license_number && { medicalLicenseNumber: profileData.medical_license_number })
    };
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Fall back to demo users if in development
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
          throw error;
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Invalid credentials');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error('Google Anmeldung fehlgeschlagen: ' + error.message);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'doctor' | 'pharmacy' = 'user') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          },
          emailRedirectTo: window.location.origin + '/dashboard'
        }
      });
      
      if (error) {
        // Fallback for demo purpose
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
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('doctor_user');
  };

  return {
    loading,
    setLoading,
    loadUserData,
    login,
    loginWithGoogle,
    register,
    logout,
  };
};
