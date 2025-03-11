
import { User } from '@/types/auth';

export const migrateUserData = (userData: any): User => {
  const parsedUser = { ...userData };
  
  // Migrate old address format to new addresses array
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
  
  // Ensure addresses array exists
  if (!parsedUser.addresses) {
    parsedUser.addresses = [];
  }
  
  // Ensure paymentMethods array exists
  if (!parsedUser.paymentMethods) {
    parsedUser.paymentMethods = [];
  }
  
  // Ensure identificationStatus exists
  if (!parsedUser.identificationStatus) {
    parsedUser.identificationStatus = 'not_verified';
  }
  
  // Set verification status for doctor and pharmacy roles
  if (!parsedUser.verificationStatus && 
      (parsedUser.role === 'doctor' || parsedUser.role === 'pharmacy')) {
    parsedUser.verificationStatus = 'not_verified';
  }
  
  // Ensure verificationDocuments array exists
  if (!parsedUser.verificationDocuments) {
    parsedUser.verificationDocuments = [];
  }
  
  return parsedUser as User;
};
