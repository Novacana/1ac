
import React from "react";
import { FileText, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

interface ComplianceAlertProps {
  onInfoClick: () => void;
}

const ComplianceAlert: React.FC<ComplianceAlertProps> = ({ onInfoClick }) => {
  return (
    <Alert className="bg-blue-50 border-blue-200">
      <FileText className="h-4 w-4 text-blue-500" />
      <AlertDescription className="text-blue-700 flex items-center justify-between">
        <span>
          Alle hochgeladenen Dokumente werden nach FHIR Standard als DocumentReference Ressourcen gespeichert und sind konform mit GDPR und HIPAA-Richtlinien.
        </span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onInfoClick}>
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
  );
};

export default ComplianceAlert;
