import React, { useState } from "react";
import { FileText, Upload, CheckCircle, AlertCircle, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { logGdprActivity } from "@/utils/fhir/activityLogging";
import { createFHIRDocumentReference } from "@/utils/fhir/resources/documentReference";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
        `User uploaded a ${documentType} document with GDPR consent`,
        { documentName: file.name, documentType: documentType }
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
        <AlertDescription className="text-blue-700 flex items-center justify-between">
          <span>
            Alle hochgeladenen Dokumente werden nach FHIR Standard als DocumentReference Ressourcen gespeichert und sind konform mit GDPR und HIPAA-Richtlinien.
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setShowPrivacyInfo(true)}>
                  <Info className="h-4 w-4 text-blue-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Mehr Informationen zu Datenschutz</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
      
      <Dialog open={showConsentDialog} onOpenChange={(open) => !open && setShowConsentDialog(false)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Datenschutz-Einwilligung</DialogTitle>
            <DialogDescription>
              Um Ihre Dokumente zu verarbeiten, benötigen wir Ihre Einwilligung gemäß DSGVO und HIPAA-Richtlinien.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Alert variant="default" className="bg-primary/5 border-primary/20">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <AlertTitle>Informationen zur Datenverarbeitung</AlertTitle>
              <AlertDescription className="text-xs">
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Ihre Dokumente werden verschlüsselt auf unseren Servern gespeichert</li>
                  <li>Die Verarbeitung erfolgt gemäß FHIR-Standard (HL7 DocumentReference)</li>
                  <li>Nur autorisiertes Personal hat Zugriff auf Ihre Dokumente</li>
                  <li>Sie können Ihre Einwilligung jederzeit widerrufen und die Löschung Ihrer Daten beantragen</li>
                  <li>Die Speicherung erfolgt konform mit DSGVO und HIPAA</li>
                </ul>
              </AlertDescription>
            </Alert>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="gdpr-consent-checkbox" 
                checked={gdprConsent}
                onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
              />
              <Label 
                htmlFor="gdpr-consent-checkbox" 
                className="text-sm leading-normal"
              >
                Ich stimme der Verarbeitung meiner hochgeladenen Dokumente zu den oben genannten Bedingungen zu und bin damit einverstanden, dass diese Daten für die Überprüfung meiner medizinischen Qualifikationen verwendet werden.
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConsentDialog(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleConsentConfirm} disabled={!gdprConsent}>
              Bestätigen und fortfahren
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showPrivacyInfo} onOpenChange={setShowPrivacyInfo}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Datenschutz- und Compliance-Informationen</DialogTitle>
            <DialogDescription>
              Detaillierte Informationen zur Verarbeitung Ihrer medizinischen Dokumente
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <h4 className="font-medium">DSGVO-Konformität</h4>
            <p className="text-sm text-muted-foreground">
              Die Verarbeitung Ihrer Dokumente erfolgt in Übereinstimmung mit der Datenschutz-Grundverordnung (DSGVO):
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
              <li>Datenminimierung: Wir erheben nur die für die Überprüfung notwendigen Daten</li>
              <li>Speicherbegrenzung: Dokumente werden nur für den erforderlichen Zeitraum gespeichert</li>
              <li>Technische Sicherheitsmaßnahmen: Verschlüsselung und Zugriffskontrollen</li>
            </ul>
            
            <h4 className="font-medium">HIPAA-Konformität</h4>
            <p className="text-sm text-muted-foreground">
              Als medizinische Plattform erfüllen wir die Anforderungen des Health Insurance Portability and Accountability Act (HIPAA):
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Privacy Rule: Schutz persönlicher Gesundheitsinformationen (PHI)</li>
              <li>Security Rule: Implementierung technischer und organisatorischer Schutzmaßnahmen</li>
              <li>Breach Notification: Protokollierung und Meldung von Datenschutzverletzungen</li>
            </ul>
            
            <h4 className="font-medium">FHIR-Standard Implementierung</h4>
            <p className="text-sm text-muted-foreground">
              Fast Healthcare Interoperability Resources (FHIR) wird für die strukturierte Speicherung verwendet:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>DocumentReference-Ressource für alle hochgeladenen Dokumente</li>
              <li>Standardisierte Metadaten gemäß HL7 FHIR R4</li>
              <li>Erweiterte Sicherheitsmerkmale gemäß SMART on FHIR</li>
            </ul>
            
            <h4 className="font-medium">Ihre Rechte</h4>
            <p className="text-sm text-muted-foreground">
              Sie haben folgende Rechte bezüglich Ihrer Daten:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowPrivacyInfo(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsTab;
