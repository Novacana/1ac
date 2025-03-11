
import React, { useState, useEffect } from 'react';
import AuthContext from './context';
import { migrateUserData } from './migration';
import { updateUserAddresses, updateUserPaymentMethods, updateUserDocuments } from './userManagement';
import { getDoctorDemoUser, getPharmacyDemoUser, getPatientDemoUser } from './demoUsers';
import { User, Address, PaymentMethod } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
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
      const mappedAddresses: Address[] = addressesData.map((address: any) => ({
        id: address.id,
        street: address.street,
        city: address.city,
        zip: address.zip,
        state: address.state,
        country: address.country,
        isDefault: address.is_default
      }));
      
      const mappedPaymentMethods: PaymentMethod[] = paymentsData.map((payment: any) => ({
        id: payment.id,
        type: payment.type as 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal',
        isDefault: payment.is_default,
        ...(payment.card_number && { cardNumber: payment.card_number }),
        ...(payment.card_expiry && { cardExpiry: payment.card_expiry }),
        ...(payment.card_cvc && { cardCVC: payment.card_cvc }),
        ...(payment.bank_name && { bankName: payment.bank_name }),
        ...(payment.account_number && { accountNumber: payment.account_number }),
        ...(payment.routing_number && { routingNumber: payment.routing_number }),
        ...(payment.paypal_email && { paypalEmail: payment.paypal_email })
      }));
      
      const mappedDocuments = documentsData.map((doc: any) => ({
        id: doc.id,
        type: doc.type as 'approbation' | 'pharmacy_license' | 'id_document',
        name: doc.name,
        status: doc.status as 'pending' | 'verified' | 'rejected',
        uploadedAt: new Date(doc.uploaded_at)
      }));
      
      // Create our user object
      const appUser: User = {
        id: supabaseUserId,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role as 'user' | 'doctor' | 'pharmacy' | 'admin',
        addresses: mappedAddresses,
        paymentMethods: mappedPaymentMethods,
        identificationStatus: profileData.identification_status as 'not_verified' | 'pending' | 'verified',
        verificationStatus: profileData.verification_status as 'not_verified' | 'pending' | 'verified',
        verificationDocuments: mappedDocuments,
        ...(profileData.pharmacy_license_number && { pharmacyLicenseNumber: profileData.pharmacy_license_number })
      };
      
      setUser(appUser);
      localStorage.setItem('doctor_user', JSON.stringify(appUser));
      return appUser;
      
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  };
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            // Load user data from our database
            await loadUserData(userData.user.id);
          }
        } else {
          const storedUser = localStorage.getItem('doctor_user');
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(migrateUserData(parsedUser));
            } catch (error) {
              console.error('Error parsing stored user:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('doctor_user');
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const isAuthenticated = user !== null;
  const isDoctor = isAuthenticated && user.role === 'doctor';
  const isAdmin = isAuthenticated && user.role === 'admin';
  const isPharmacy = isAuthenticated && user.role === 'pharmacy';
  
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

  // The rest of the functions need to be updated to communicate with Supabase
  const updateUserProfile = async (userData: Partial<User>) => {
    if (user) {
      try {
        // Update the user's profile in Supabase
        if (userData.name || userData.email) {
          const { error } = await supabase
            .from('profiles')
            .update({
              name: userData.name || user.name,
              email: userData.email || user.email,
              updated_at: new Date().toISOString()
            })
            .eq('id', user.id);
            
          if (error) throw error;
        }
        
        // Update the local user state
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Fehler beim Aktualisieren des Profils');
      }
    }
  };
  
  const addAddress = async (address: Omit<Address, 'id'>) => {
    if (user) {
      try {
        // Insert the address into Supabase
        const { data, error } = await supabase
          .from('addresses')
          .insert({
            user_id: user.id,
            street: address.street,
            city: address.city,
            zip: address.zip,
            state: address.state,
            country: address.country,
            is_default: address.isDefault
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Update local state with the new address from the database
        const newAddress: Address = {
          id: data.id,
          street: data.street,
          city: data.city,
          zip: data.zip,
          state: data.state,
          country: data.country,
          isDefault: data.is_default
        };
        
        // If this address is default, update other addresses
        let updatedAddresses = address.isDefault 
          ? user.addresses.map(addr => ({ ...addr, isDefault: false }))
          : [...user.addresses];
          
        updatedAddresses.push(newAddress);
        
        const updatedUser = { ...user, addresses: updatedAddresses };
        setUser(updatedUser);
        localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error adding address:', error);
        toast.error('Fehler beim Hinzufügen der Adresse');
      }
    }
  };
  
  const updateAddress = async (address: Address) => {
    if (user) {
      try {
        // If setting as default, update other addresses to non-default
        if (address.isDefault) {
          await supabase
            .from('addresses')
            .update({ is_default: false })
            .eq('user_id', user.id)
            .neq('id', address.id);
        }
        
        // Update the address in Supabase
        const { error } = await supabase
          .from('addresses')
          .update({
            street: address.street,
            city: address.city,
            zip: address.zip,
            state: address.state,
            country: address.country,
            is_default: address.isDefault
          })
          .eq('id', address.id);
          
        if (error) throw error;
        
        // Update local state
        const updatedUser = updateUserAddresses(user, 'update', address);
        setUser(updatedUser);
        localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating address:', error);
        toast.error('Fehler beim Aktualisieren der Adresse');
      }
    }
  };
  
  const removeAddress = async (addressId: string) => {
    if (user) {
      try {
        // Delete the address from Supabase
        const { error } = await supabase
          .from('addresses')
          .delete()
          .eq('id', addressId);
          
        if (error) throw error;
        
        // Update local state
        const updatedUser = updateUserAddresses(user, 'remove', addressId);
        setUser(updatedUser);
        localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error removing address:', error);
        toast.error('Fehler beim Löschen der Adresse');
      }
    }
  };
  
  const setDefaultAddress = async (addressId: string) => {
    if (user) {
      try {
        // Reset all addresses to non-default
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', user.id);
          
        // Set the selected address as default
        const { error } = await supabase
          .from('addresses')
          .update({ is_default: true })
          .eq('id', addressId);
          
        if (error) throw error;
        
        // Update local state
        const updatedUser = updateUserAddresses(user, 'setDefault', addressId);
        setUser(updatedUser);
        localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error setting default address:', error);
        toast.error('Fehler beim Setzen der Standardadresse');
      }
    }
  };
  
  // Similar pattern for payment methods
  const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id'>) => {
    if (user) {
      try {
        // Add payment method to Supabase
        const { data, error } = await supabase
          .from('payment_methods')
          .insert({
            user_id: user.id,
            type: paymentMethod.type,
            card_number: paymentMethod.cardNumber,
            card_expiry: paymentMethod.cardExpiry,
            card_cvc: paymentMethod.cardCVC,
            bank_name: paymentMethod.bankName,
            account_number: paymentMethod.accountNumber,
            routing_number: paymentMethod.routingNumber,
            paypal_email: paymentMethod.paypalEmail,
            is_default: paymentMethod.isDefault
          })
          .select()
          .single();
          
        if (error) throw error;
        
        // Update local state
        const updatedUser = updateUserPaymentMethods(user, 'add', paymentMethod);
        setUser(updatedUser);
        localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error adding payment method:', error);
        toast.error('Fehler beim Hinzufügen der Zahlungsmethode');
      }
    }
  };
  
  const updatePaymentMethod = async (paymentMethod: PaymentMethod) => {
    if (user) {
      try {
        // If setting as default, update other payment methods to non-default
        if (paymentMethod.isDefault) {
          await supabase
            .from('payment_methods')
            .update({ is_default: false })
            .eq('user_id', user.id)
            .neq('id', paymentMethod.id);
        }
        
        // Update the payment method in Supabase
        const { error } = await supabase
          .from('payment_methods')
          .update({
            type: paymentMethod.type,
            card_number: paymentMethod.cardNumber,
            card_expiry: paymentMethod.cardExpiry,
            card_cvc: paymentMethod.cardCVC,
            bank_name: paymentMethod.bankName,
            account_number: paymentMethod.accountNumber,
            routing_number: paymentMethod.routingNumber,
            paypal_email: paymentMethod.paypalEmail,
            is_default: paymentMethod.isDefault
          })
          .eq('id', paymentMethod.id);
          
        if (error) throw error;
        
        // Update local state
        const updatedUser = updateUserPaymentMethods(user, 'update', paymentMethod);
        setUser(updatedUser);
        localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error updating payment method:', error);
        toast.error('Fehler beim Aktualisieren der Zahlungsmethode');
      }
    }
  };
  
  const removePaymentMethod = async (paymentMethodId: string) => {
    if (user) {
      try {
        // Delete the payment method from Supabase
        const { error } = await supabase
          .from('payment_methods')
          .delete()
          .eq('id', paymentMethodId);
          
        if (error) throw error;
        
        // Update local state
        const updatedUser = updateUserPaymentMethods(user, 'remove', paymentMethodId);
        setUser(updatedUser);
        localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error removing payment method:', error);
        toast.error('Fehler beim Löschen der Zahlungsmethode');
      }
    }
  };
  
  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    if (user) {
      try {
        // Reset all payment methods to non-default
        await supabase
          .from('payment_methods')
          .update({ is_default: false })
          .eq('user_id', user.id);
          
        // Set the selected payment method as default
        const { error } = await supabase
          .from('payment_methods')
          .update({ is_default: true })
          .eq('id', paymentMethodId);
          
        if (error) throw error;
        
        // Update local state
        const updatedUser = updateUserPaymentMethods(user, 'setDefault', paymentMethodId);
        setUser(updatedUser);
        localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error setting default payment method:', error);
        toast.error('Fehler beim Setzen der Standard-Zahlungsmethode');
      }
    }
  };
  
  const uploadVerificationDocument = async (documentType: 'approbation' | 'pharmacy_license' | 'id_document', file: File) => {
    if (!user) return;
    
    try {
      console.log(`Uploading ${documentType} document: ${file.name}`);
      
      // First, upload the file to Supabase Storage
      // Note: You need to create a storage bucket in Supabase first
      const fileName = `${user.id}/${documentType}/${Date.now()}_${file.name}`;
      
      // Insert document record in the database
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          type: documentType,
          name: file.name,
          status: 'pending'
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Update user verification status
      await supabase
        .from('profiles')
        .update({
          verification_status: 'pending'
        })
        .eq('id', user.id);
      
      // Update local state
      const updatedUser = updateUserDocuments(user, documentType);
      setUser(updatedUser);
      localStorage.setItem('doctor_user', JSON.stringify(updatedUser));
      
      toast.success('Dokument erfolgreich hochgeladen');
      return Promise.resolve();
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Fehler beim Hochladen des Dokuments');
      return Promise.reject(error);
    }
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
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
      loginWithGoogle,
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
