
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logGdprActivity } from "@/utils/fhir/activityLogging";
import { createFHIRDocumentReference } from "@/utils/fhir/resources/documentReference";
import { useAuth } from "@/contexts/AuthContext";

export interface DocumentUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

export const useDocumentUpload = () => {
  const { user } = useAuth();
  const [approbationUpload, setApprobationUpload] = useState<DocumentUpload | null>(null);
  const [specialistUpload, setSpecialistUpload] = useState<DocumentUpload | null>(null);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{file: File, type: 'approbation' | 'specialist'} | null>(null);
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: 'approbation' | 'specialist') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Datei zu groß (max. 10MB)');
      return;
    }
    
    const fileType = file.type;
    if (fileType !== 'application/pdf' && fileType !== 'image/jpeg' && fileType !== 'image/png') {
      toast.error('Nur PDF, JPG oder PNG erlaubt');
      return;
    }
    
    const hasStoredConsent = localStorage.getItem('document_upload_consent') === 'true';
    
    if (hasStoredConsent) {
      processUpload(file, documentType);
    } else {
      setPendingUpload({file, type: documentType});
      setShowConsentDialog(true);
    }
  };
  
  const processUpload = async (file: File, documentType: 'approbation' | 'specialist') => {
    const setUploadState = documentType === 'approbation' ? setApprobationUpload : setSpecialistUpload;
    setUploadState({
      file,
      progress: 0,
      status: 'uploading'
    });
    
    try {
      if (!user) {
        throw new Error('Benutzer nicht angemeldet');
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${documentType}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const progressInterval = setInterval(() => {
        setUploadState(prev => {
          if (!prev) return prev;
          
          const newProgress = Math.min(prev.progress + 10, 90);
          return {
            ...prev,
            progress: newProgress
          };
        });
      }, 300);
      
      const { error: uploadError, data } = await supabase.storage
        .from('medical_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      clearInterval(progressInterval);
      
      if (uploadError) throw uploadError;
      
      const fhirDocumentReference = createFHIRDocumentReference(
        user.id,
        {
          id: crypto.randomUUID(),
          name: file.name,
          type: documentType,
          status: 'pending',
          contentType: file.type,
          url: filePath,
          size: file.size
        }
      );
      
      console.log('FHIR DocumentReference created:', fhirDocumentReference);
      
      await logGdprActivity(
        user.id,
        `${documentType}_document_upload`,
        `User uploaded a ${documentType} document with GDPR consent`
      );
      
      setUploadState({
        file,
        progress: 100,
        status: 'success'
      });
      
      toast.success(`${documentType === 'approbation' ? 'Approbationsurkunde' : 'Facharztnachweis'} erfolgreich hochgeladen`);
      
    } catch (error: any) {
      console.error(`Error uploading ${documentType} document:`, error);
      
      setUploadState({
        file,
        progress: 0,
        status: 'error',
        errorMessage: error.message || 'Fehler beim Hochladen'
      });
      
      toast.error(`Fehler beim Hochladen: ${error.message || 'Unbekannter Fehler'}`);
    }
  };
  
  const handleConsentConfirm = () => {
    if (gdprConsent && pendingUpload) {
      localStorage.setItem('document_upload_consent', 'true');
      setShowConsentDialog(false);
      processUpload(pendingUpload.file, pendingUpload.type);
      setPendingUpload(null);
    } else {
      toast.error('Bitte stimmen Sie der Datenverarbeitung zu, um fortzufahren');
    }
  };

  return {
    approbationUpload,
    specialistUpload,
    gdprConsent,
    showConsentDialog,
    showPrivacyInfo,
    setGdprConsent,
    setShowConsentDialog,
    setShowPrivacyInfo,
    handleFileUpload,
    handleConsentConfirm
  };
};
