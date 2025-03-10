
import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import ConsentHeader from "./gdpr/ConsentHeader";
import ConsentContent from "./gdpr/ConsentContent";
import ConsentFooter from "./gdpr/ConsentFooter";

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
        <ConsentHeader />
        <ConsentContent />
        <ConsentFooter onAccept={onAccept} onDecline={onDecline} />
      </DialogContent>
    </Dialog>
  );
};

export default GDPRConsentModal;
