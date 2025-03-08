
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Lock, ShieldAlert } from "lucide-react";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-primary" />
            Datenschutz-Einwilligung
          </DialogTitle>
          <DialogDescription>
            Gemäß der DSGVO (GDPR) benötigen wir Ihre Einwilligung, bevor wir eine Verbindung zu externen Diensten herstellen.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="mb-2 font-medium">Durch das Verbinden mit externen Diensten:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Werden Ihre Daten mit Drittanbietern geteilt</li>
              <li>Können Produktdaten synchronisiert werden</li>
              <li>Können Bestandsdaten übertragen werden</li>
            </ul>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              Ihre Daten werden gemäß unserer Datenschutzrichtlinie verarbeitet
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
            onClick={() => window.open("/datenschutz", "_blank")}
          >
            Datenschutzrichtlinie
            <ExternalLink className="h-3 w-3" />
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onDecline}>
              Ablehnen
            </Button>
            <Button onClick={onAccept}>
              Akzeptieren & Fortfahren
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRConsentModal;
