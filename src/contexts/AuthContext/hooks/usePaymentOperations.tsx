
import { User, PaymentMethod } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { updateUserPaymentMethods } from '../userManagement';

export const usePaymentOperations = (user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
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
            is_default: paymentMethod.isDefault,
            card_holder: paymentMethod.cardHolder,
            expiry_date: paymentMethod.expiryDate
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
            is_default: paymentMethod.isDefault,
            card_holder: paymentMethod.cardHolder,
            expiry_date: paymentMethod.expiryDate
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

  return {
    addPaymentMethod,
    updatePaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod
  };
};
