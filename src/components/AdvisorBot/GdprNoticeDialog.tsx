
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface GdprNoticeDialogProps {
  isOpen: boolean;
  onConsent: (hasConsent: boolean) => void;
  onDismiss: () => void;
}

const GdprNoticeDialog: React.FC<GdprNoticeDialogProps> = ({
  isOpen,
  onConsent,
  onDismiss,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Datenschutzhinweis gemäß DSGVO
          </DialogTitle>
          <DialogDescription>
            Für eine personalisierte Beratung und Spracherkennung benötigen wir Ihre Einwilligung.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Datenverarbeitung für Spracherkennung</h4>
            <p className="text-sm text-muted-foreground">
              Wenn Sie der Spracherkennung zustimmen, werden Ihre Sprachdaten über Ihren Browser aufgezeichnet und zur Analyse verwendet. Diese Daten werden gemäß Art. 6 Abs. 1 lit. a DSGVO verarbeitet.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Chat-Verlauf und Beratung</h4>
            <p className="text-sm text-muted-foreground">
              Ihre Nachrichten im Chat werden gespeichert, um Ihnen eine personalisierte Beratung zu ermöglichen. Diese Daten werden nach Beendigung der Beratungssitzung für einen Zeitraum von 30 Tagen aufbewahrt.
            </p>
          </div>

          <div className="border rounded-md p-3 bg-amber-50 dark:bg-amber-950">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="font-medium">Wichtiger Hinweis:</h4>
            </div>
            <p className="text-sm mt-1 text-amber-700 dark:text-amber-400">
              Sie können den Berater auch ohne Einwilligung zur Datenverarbeitung nutzen, allerdings stehen dann bestimmte Funktionen wie Spracherkennung nicht zur Verfügung.
            </p>
          </div>

          <div className="text-sm flex items-center gap-1.5 pt-2">
            <Link to="/datenschutz" target="_blank" className="text-primary hover:underline flex items-center">
              Vollständige Datenschutzrichtlinie lesen
              <ExternalLink className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onDismiss}
            className="sm:w-full"
          >
            Ablehnen
          </Button>
          <Button
            onClick={() => onConsent(true)}
            className="sm:w-full"
          >
            Einwilligen gemäß DSGVO
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GdprNoticeDialog;
