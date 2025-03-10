
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { gdprNotice } from "./hooks/useAdvisorGdpr";

interface GdprNoticeDialogProps {
  isOpen: boolean;
  onConsent: () => void;
  onDismiss: () => void;
}

const GdprNoticeDialog: React.FC<GdprNoticeDialogProps> = ({
  isOpen,
  onConsent,
  onDismiss
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border-2 border-primary">
        <div className="p-6 space-y-4">
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
            DSGVO-Zustimmung erforderlich
          </h3>
          <p className="text-sm">
            {gdprNotice}
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onDismiss}
            >
              Ablehnen
            </Button>
            <Button 
              variant="default"
              onClick={onConsent}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Zustimmen
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GdprNoticeDialog;
