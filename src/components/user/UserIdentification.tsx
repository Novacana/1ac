import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Shield, Fingerprint, SmartphoneNfc, CreditCard, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const UserIdentification = () => {
  const { user, updateUserProfile } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const identificationStatus = user?.identificationStatus || "not_verified";
  
  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };
  
  const handleStartIdentification = () => {
    if (!selectedMethod) {
      toast.error("Bitte wählen Sie eine Identifikationsmethode");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulierte Identifikation
    setTimeout(() => {
      // In einer echten Anwendung würde hier die tatsächliche Identifikation stattfinden
      updateUserProfile({ 
        identificationStatus: "pending" // Changed from "pending_review" to "pending"
      });
      
      setIsProcessing(false);
      toast.success("Identifikation eingeleitet");
      
      // Simuliere erfolgreiche Identifikation nach einer Weile
      setTimeout(() => {
        updateUserProfile({ 
          identificationStatus: "verified" 
        });
        toast.success("Identifikation erfolgreich abgeschlossen");
      }, 5000);
    }, 2000);
  };
  
  const renderVerificationStatus = () => {
    switch (identificationStatus) {
      case "verified":
        return (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
            <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
            <AlertTitle className="text-green-800 dark:text-green-400">Identifikation abgeschlossen</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">
              Ihre Identität wurde erfolgreich bestätigt. Sie können nun alle Funktionen der Plattform nutzen.
            </AlertDescription>
          </Alert>
        );
      case "pending":
      case "pending_review":
        return (
          <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900">
            <Fingerprint className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-400">Überprüfung läuft</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              Ihre Identifikation wird derzeit überprüft. Dies kann einige Minuten dauern.
            </AlertDescription>
          </Alert>
        );
      case "failed":
        return (
          <Alert variant="destructive">
            <X className="h-4 w-4" />
            <AlertTitle>Identifikation fehlgeschlagen</AlertTitle>
            <AlertDescription>
              Ihre Identifikation konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut oder wählen Sie eine andere Methode.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Identifikation</h2>
      
      {renderVerificationStatus()}
      
      {identificationStatus !== "verified" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <IdentificationMethodCard
              title="eID / Online-Ausweis"
              description="Identifikation mit elektronischem Personalausweis"
              icon={<SmartphoneNfc className="h-6 w-6" />}
              selected={selectedMethod === "eid"}
              onSelect={() => handleMethodSelect("eid")}
              disabled={isProcessing}
            />
            
            <IdentificationMethodCard
              title="Video-Ident"
              description="Identifikation per Videoanruf mit einem Agenten"
              icon={<Fingerprint className="h-6 w-6" />}
              selected={selectedMethod === "video"}
              onSelect={() => handleMethodSelect("video")}
              disabled={isProcessing}
              badge="Empfohlen"
            />
            
            <IdentificationMethodCard
              title="Online-Banking"
              description="Identifikation über Ihr Online-Banking-Konto"
              icon={<CreditCard className="h-6 w-6" />}
              selected={selectedMethod === "banking"}
              onSelect={() => handleMethodSelect("banking")}
              disabled={isProcessing}
            />
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Warum ist eine Identifikation notwendig?</AlertTitle>
                  <AlertDescription>
                    Für die Verschreibung und den Erwerb von Medizinalcannabis ist eine sichere Identifikation 
                    gemäß gesetzlicher Vorschriften erforderlich. Dies stellt sicher, dass Rezepte nur 
                    an berechtigte Personen ausgestellt werden.
                  </AlertDescription>
                </Alert>
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleStartIdentification} 
                    disabled={!selectedMethod || isProcessing}
                    className="gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                        Wird bearbeitet...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="h-4 w-4" />
                        Identifikation starten
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

interface IdentificationMethodCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  badge?: string;
}

const IdentificationMethodCard: React.FC<IdentificationMethodCardProps> = ({
  title,
  description,
  icon,
  selected,
  onSelect,
  disabled = false,
  badge
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${
        selected 
          ? 'border-primary ring-1 ring-primary' 
          : 'hover:border-primary/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={disabled ? undefined : onSelect}
    >
      <CardHeader className="pb-2 relative">
        {badge && (
          <Badge className="absolute top-2 right-2 bg-primary">{badge}</Badge>
        )}
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`h-4 w-4 rounded-full border-2 ml-auto ${
          selected ? 'bg-primary border-primary' : 'border-muted-foreground'
        }`} />
      </CardContent>
    </Card>
  );
};

export default UserIdentification;
