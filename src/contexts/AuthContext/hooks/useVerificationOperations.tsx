
import { User, Document } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { updateUserDocuments } from '../userManagement';
import { logGdprActivity } from '@/utils/fhirCompliance';

export const useVerificationOperations = (user: User | null, setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  const uploadVerificationDocument = async (documentType: 'approbation' | 'pharmacy_license' | 'id_document', file: File) => {
    if (!user) return;
    
    try {
      console.log(`Uploading ${documentType} document: ${file.name}`);
      
      // Create a storage bucket path
      const fileName = `${user.id}/${documentType}/${Date.now()}_${file.name}`;
      const filePath = `documents/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
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
      
      // Log GDPR activity
      await logGdprActivity(
        user.id, 
        'document_upload', 
        `User uploaded verification document: ${documentType}`
      );
      
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

  const getDocumentUploadUrl = async (documentType: 'approbation' | 'pharmacy_license' | 'id_document', fileName: string) => {
    if (!user) return null;
    
    try {
      const filePath = `documents/${user.id}/${documentType}/${Date.now()}_${fileName}`;
      
      // Generate a presigned URL for upload
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUploadUrl(filePath);
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error generating upload URL:', error);
      return null;
    }
  };

  return {
    uploadVerificationDocument,
    getDocumentUploadUrl
  };
};
