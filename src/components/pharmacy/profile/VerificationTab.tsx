import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/types/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VerificationTabProps {
  user: User | null;
  updateStatus: (status: boolean) => void;
}

const VerificationTab: React.FC<VerificationTabProps> = ({ user, updateStatus }) => {
  const handleUploadDocument = () => {
    // Placeholder for document upload logic
    // After successful upload and verification, call updateStatus(true)
    alert("Dokument wird hochgeladen...");
    updateStatus(true); // Simulate successful verification
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Verifizierungsstatus</h2>

      <Card>
        <CardContent className="space-y-4">
          {user?.verificationStatus === 'verified' ? (
            <Alert variant="success">
              <Shield className="h-4 w-4" />
              <AlertTitle>Verifiziert</AlertTitle>
              <AlertDescription>
                Ihre Apotheke ist vollständig verifiziert und alle Funktionen sind freigeschaltet.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertTitle>Nicht verifiziert</AlertTitle>
              <AlertDescription>
                Ihre Apotheke ist noch nicht verifiziert. Bitte laden Sie die erforderlichen Dokumente hoch.
              </AlertDescription>
            </Alert>
          )}

          <Card>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-semibold">
                Betriebserlaubnis
              </h3>
              <p className="text-muted-foreground">
                Laden Sie hier Ihre Betriebserlaubnis hoch, um Ihre Apotheke zu verifizieren.
              </p>

              <div className="border-2 border-dashed border-muted-foreground/50 rounded-md p-4 text-center">
                <FileCheck className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Ziehen Sie Ihre Datei hierher oder klicken Sie, um sie auszuwählen
                </p>
                <Button onClick={handleUploadDocument} className="mt-4">
                  Datei hochladen
                </Button>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Datenschutzhinweis</AlertTitle>
                <AlertDescription>
                  Ihre Dokumente werden sicher gespeichert und nur zur Verifizierung Ihrer Apotheke verwendet.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationTab;
