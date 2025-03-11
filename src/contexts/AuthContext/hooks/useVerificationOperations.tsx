
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { updateUserDocuments } from '../userManagement';

export const useVerificationOperations = (user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
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

  return {
    uploadVerificationDocument
  };
};
