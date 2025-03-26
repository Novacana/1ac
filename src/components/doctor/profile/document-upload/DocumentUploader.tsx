
import React, { useState } from "react";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface DocumentUpload {
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

interface DocumentUploaderProps {
  title: string;
  documentType: 'approbation' | 'specialist';
  uploadState: DocumentUpload | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  title,
  documentType,
  uploadState,
  onFileSelect,
}) => {
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
    <div className="bg-muted/30 rounded-lg p-6 border">
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
        <div className="mx-auto flex flex-col items-center justify-center gap-1">
          <FileText className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground mt-2">
            Ziehen Sie Ihre {title} hierher oder klicken Sie zum Hochladen
          </p>
          <p className="text-xs text-muted-foreground/70">
            PDF, JPG oder PNG (max. 10MB)
          </p>
          <input
            type="file"
            id={`${documentType}-upload`}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={onFileSelect}
          />
          <Button 
            className="mt-4"
            onClick={() => document.getElementById(`${documentType}-upload`)?.click()}
            disabled={uploadState?.status === 'uploading'}
          >
            {uploadState?.status === 'uploading' ? (
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
          {renderUploadState(uploadState)}
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;
