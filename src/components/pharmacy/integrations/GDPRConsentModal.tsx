
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShieldAlert, Lock } from "lucide-react";

interface GDPRConsentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onDecline: () => void;
}

const GDPRConsentModal: React.FC<GDPRConsentModalProps> = ({
  open,
  onOpenChange,
  onAccept,
  onDecline,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex items-start">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <DialogTitle className="text-xl">Datenschutz-Einwilligung</DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Gemäß der DSGVO (GDPR) benötigen wir Ihre Einwilligung, bevor wir eine Verbindung zu externen Diensten herstellen.
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-5 text-sm">
            <h3 className="mb-3 font-medium text-base">Durch das Verbinden mit externen Diensten:</h3>
            <ul className="space-y-3 pl-1">
              <li className="flex items-start gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">•</span>
                <span>Werden Ihre Daten mit Drittanbietern geteilt</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">•</span>
                <span>Können Produktdaten synchronisiert werden</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">•</span>
                <span>Können Bestandsdaten übertragen werden</span>
              </li>
            </ul>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              Ihre Daten werden gemäß unserer Datenschutzrichtlinie verarbeitet
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs rounded-xl sm:w-auto w-full"
            onClick={() => window.open("/datenschutz", "_blank")}
          >
            Datenschutzrichtlinie
            <ExternalLink className="h-3 w-3" />
          </Button>
          <div className="flex gap-3 sm:flex-row flex-col w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={onDecline}
              className="rounded-xl hover:bg-muted sm:order-1 order-2"
            >
              Ablehnen
            </Button>
            <Button 
              onClick={onAccept}
              className="rounded-xl bg-green-500 hover:bg-green-600 sm:order-2 order-1"
            >
              Akzeptieren & Fortfahren
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRConsentModal;
