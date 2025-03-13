
import React, { useState } from "react";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logGdprActivity } from "@/utils/fhirCompliance";
import { useAuth } from "@/contexts/AuthContext";

interface DocumentUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

const DocumentsTab: React.FC = () => {
  const { user } = useAuth();
  const [approbationUpload, setApprobationUpload] = useState<DocumentUpload | null>(null);
  const [specialistUpload, setSpecialistUpload] = useState<DocumentUpload | null>(null);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, documentType: 'approbation' | 'specialist') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Datei zu groß (max. 10MB)');
      return;
    }
    
    // Allow only PDF, JPG or PNG
    const fileType = file.type;
    if (fileType !== 'application/pdf' && fileType !== 'image/jpeg' && fileType !== 'image/png') {
      toast.error('Nur PDF, JPG oder PNG erlaubt');
      return;
    }
    
    // Set initial upload state
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
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}_${documentType}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('medical_documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) throw uploadError;
      
      // Log GDPR activity for this document upload
      await logGdprActivity(
        user.id,
        `${documentType}_document_upload`,
        `User uploaded a ${documentType} document`
      );
      
      // Update upload state to success
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
  
  const renderUploadState = (upload: DocumentUpload | null) => {
    if (!upload) return null;
    
    return (
      <div className="mt-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium truncate max-w-xs">{upload.file.name}</span>
          <span className="text-muted-foreground">({Math.round(upload.file.size / 1024)} KB)</span>
        </div>
        
        {upload.status === 'uploading' && (
          <div className="mt-2">
            <Progress value={upload.progress} className="h-2" />
          </div>
        )}
        
        {upload.status === 'success' && (
          <div className="flex items-center gap-2 mt-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span>Hochladen erfolgreich</span>
          </div>
        )}
        
        {upload.status === 'error' && (
          <div className="flex items-center gap-2 mt-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span>{upload.errorMessage || 'Fehler beim Hochladen'}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <FileText className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Alle hochgeladenen Dokumente werden nach FHIR Standard als DocumentReference Ressourcen gespeichert und sind konform mit GDPR und HIPAA-Richtlinien.
        </AlertDescription>
      </Alert>
    
      <h3 className="text-lg font-medium">Approbationsnachweise</h3>
      <div className="bg-muted/30 rounded-lg p-6 border">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <div className="mx-auto flex flex-col items-center justify-center gap-1">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-2">
              Ziehen Sie Ihre Approbationsurkunde hierher oder klicken Sie zum Hochladen
            </p>
            <p className="text-xs text-muted-foreground/70">
              PDF, JPG oder PNG (max. 10MB)
            </p>
            <input
              type="file"
              id="approbation-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, 'approbation')}
            />
            <Button 
              className="mt-4"
              onClick={() => document.getElementById('approbation-upload')?.click()}
              disabled={approbationUpload?.status === 'uploading'}
            >
              {approbationUpload?.status === 'uploading' ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Wird hochgeladen...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Datei auswählen
                </>
              )}
            </Button>
            {renderUploadState(approbationUpload)}
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mt-6">Facharztnachweise</h3>
      <div className="bg-muted/30 rounded-lg p-6 border">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <div className="mx-auto flex flex-col items-center justify-center gap-1">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-2">
              Ziehen Sie Ihre Facharztanerkennung hierher oder klicken Sie zum Hochladen
            </p>
            <p className="text-xs text-muted-foreground/70">
              PDF, JPG oder PNG (max. 10MB)
            </p>
            <input
              type="file"
              id="specialist-upload"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e, 'specialist')}
            />
            <Button 
              className="mt-4"
              onClick={() => document.getElementById('specialist-upload')?.click()}
              disabled={specialistUpload?.status === 'uploading'}
            >
              {specialistUpload?.status === 'uploading' ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                  Wird hochgeladen...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Datei auswählen
                </>
              )}
            </Button>
            {renderUploadState(specialistUpload)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
