
import { User, Address, PaymentMethod } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { updateUserAddresses, updateUserPaymentMethods, updateUserDocuments } from '../userManagement';

export const useProfileOperations = (user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  const updateUserProfile = async (userData: Partial<User>) => {
    if (user) {
      try {
        // Update the user's profile in Supabase
        if (userData.name || userData.email || userData.phone) {
          const { error } = await supabase
            .from('profiles')
            .update({
              name: userData.name || user.name,
              email: userData.email || user.email,
              phone: userData.phone || user.phone,
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
            is_default: address.isDefault,
            additional_info: address.additionalInfo
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
          isDefault: data.is_default,
          additionalInfo: data.additional_info
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
            is_default: address.isDefault,
            additional_info: address.additionalInfo
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

  return {
    updateUserProfile,
    addAddress,
    updateAddress,
    removeAddress,
    setDefaultAddress
  };
};
