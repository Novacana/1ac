
import React, { useState } from "react";
import { User } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, Check, FileText, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface VerificationTabProps {
  user: User | null;
  updateStatus: (isComplete: boolean) => void;
}

const VerificationTab: React.FC<VerificationTabProps> = ({ user, updateStatus }) => {
  const [uploading, setUploading] = useState(false);
  
  const isIdentificationVerified = user?.identificationStatus === 'verified';
  const isLicenseVerified = user?.verificationStatus === 'verified';
  
  const handleUploadLicense = () => {
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      toast.success("Dokument erfolgreich hochgeladen. Es wird nun überprüft.");
    }, 1500);
  };
  
  const renderStatus = (status?: string) => {
    switch (status) {
      case 'verified':
        return (
          <div className="flex items-center gap-1 text-green-600">
            <Check className="h-4 w-4" />
            <span>Verifiziert</span>
          </div>
        );
      case 'pending_review':
        return (
          <div className="flex items-center gap-1 text-amber-600">
            <AlertCircle className="h-4 w-4" />
            <span>In Überprüfung</span>
          </div>
        );
      case 'failed':
        return (
          <div className="flex items-center gap-1 text-red-600">
            <X className="h-4 w-4" />
            <span>Verifizierung fehlgeschlagen</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Nicht verifiziert</span>
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Apotheken-Verifizierung</h3>
          <p className="text-sm text-muted-foreground">
            Um alle Funktionen nutzen zu können, benötigen wir einige Dokumente zur Verifizierung Ihrer Apotheke
          </p>
        </div>
        
        {/* Identification Verification */}
        <Card className={isIdentificationVerified ? "border-green-200" : ""}>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Identifikation</h4>
                <p className="text-sm text-muted-foreground">
                  Persönliche Identifikation des Apothekeninhabers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {renderStatus(user?.identificationStatus)}
              
              {!isIdentificationVerified && (
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={user?.identificationStatus === 'pending_review'}
                  onClick={() => toast.info("Identifikations-Prozess wird vorbereitet...")}
                >
                  <Upload className="h-4 w-4" />
                  Identifizieren
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* License Verification */}
        <Card className={isLicenseVerified ? "border-green-200" : ""}>
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="p-2 rounded-full bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Apothekenlizenz</h4>
                <p className="text-sm text-muted-foreground">
                  Offizielle Lizenz für den Betrieb Ihrer Apotheke
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {renderStatus(user?.verificationStatus)}
              
              {!isLicenseVerified && (
                <Button 
                  variant="outline"
                  className="flex items-center gap-2"
                  disabled={user?.verificationStatus === 'pending_review' || uploading}
                  onClick={handleUploadLicense}
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2" />
                      Hochladen...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Lizenz hochladen
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="pt-4 space-y-2">
        <h4 className="font-medium">Hinweise zur Verifizierung</h4>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Die Verifizierung kann bis zu 2 Werktage dauern</li>
          <li>Alle Dokumente müssen klar lesbar sein</li>
          <li>Wir akzeptieren PDF, JPG und PNG Dateien (max. 10MB)</li>
          <li>Alle Daten werden gemäß DSGVO und HIPAA geschützt</li>
        </ul>
      </div>
    </div>
  );
};

export default VerificationTab;
