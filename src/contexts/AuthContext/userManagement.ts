
import { User, Address, PaymentMethod } from '@/types/auth';

export const updateUserAddresses = (
  user: User,
  action: 'add' | 'update' | 'remove' | 'setDefault',
  addressData: Address | Omit<Address, 'id'> | string
): User => {
  switch (action) {
    case 'add': {
      const address = addressData as Omit<Address, 'id'>;
      const newAddress = {
        ...address,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      const updatedAddresses = address.isDefault 
        ? user.addresses.map(addr => ({ ...addr, isDefault: false }))
        : [...user.addresses];
        
      updatedAddresses.push(newAddress);
      
      return { ...user, addresses: updatedAddresses };
    }
    
    case 'update': {
      const address = addressData as Address;
      const updatedAddresses = user.addresses.map(addr => 
        addr.id === address.id 
          ? address 
          : address.isDefault ? { ...addr, isDefault: false } : addr
      );
      
      return { ...user, addresses: updatedAddresses };
    }
    
    case 'remove': {
      const addressId = addressData as string;
      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      
      if (user.addresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      return { ...user, addresses: updatedAddresses };
    }
    
    case 'setDefault': {
      const addressId = addressData as string;
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      return { ...user, addresses: updatedAddresses };
    }
    
    default:
      return user;
  }
};

export const updateUserPaymentMethods = (
  user: User,
  action: 'add' | 'update' | 'remove' | 'setDefault',
  paymentData: PaymentMethod | Omit<PaymentMethod, 'id'> | string
): User => {
  switch (action) {
    case 'add': {
      const paymentMethod = paymentData as Omit<PaymentMethod, 'id'>;
      const newPaymentMethod = {
        ...paymentMethod,
        id: Math.random().toString(36).substring(2, 9)
      };
      
      const updatedPaymentMethods = paymentMethod.isDefault 
        ? user.paymentMethods.map(pm => ({ ...pm, isDefault: false }))
        : [...user.paymentMethods];
        
      updatedPaymentMethods.push(newPaymentMethod);
      
      return { ...user, paymentMethods: updatedPaymentMethods };
    }
    
    case 'update': {
      const paymentMethod = paymentData as PaymentMethod;
      const updatedPaymentMethods = user.paymentMethods.map(pm => 
        pm.id === paymentMethod.id 
          ? paymentMethod 
          : paymentMethod.isDefault ? { ...pm, isDefault: false } : pm
      );
      
      return { ...user, paymentMethods: updatedPaymentMethods };
    }
    
    case 'remove': {
      const paymentMethodId = paymentData as string;
      const updatedPaymentMethods = user.paymentMethods.filter(pm => pm.id !== paymentMethodId);
      
      if (user.paymentMethods.find(pm => pm.id === paymentMethodId)?.isDefault && updatedPaymentMethods.length > 0) {
        updatedPaymentMethods[0].isDefault = true;
      }
      
      return { ...user, paymentMethods: updatedPaymentMethods };
    }
    
    case 'setDefault': {
      const paymentMethodId = paymentData as string;
      const updatedPaymentMethods = user.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId
      }));
      
      return { ...user, paymentMethods: updatedPaymentMethods };
    }
    
    default:
      return user;
  }
};

export const updateUserDocuments = (
  user: User,
  documentType: 'approbation' | 'pharmacy_license' | 'id_document'
): User => {
  const newDocument = {
    id: Math.random().toString(36).substring(2, 9),
    type: documentType,
    status: 'pending' as const,
    uploadDate: new Date().toISOString().split('T')[0]
  };
  
  return { 
    ...user,
    verificationDocuments: [...(user.verificationDocuments || []), newDocument],
    verificationStatus: 'pending_review' as const
  };
};
