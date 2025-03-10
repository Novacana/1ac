
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ConsentFooterProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentFooter: React.FC<ConsentFooterProps> = ({ onAccept, onDecline }) => {
  return (
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
  );
};

export default ConsentFooter;
