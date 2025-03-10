
import React from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface ConsentFooterProps {
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentFooter: React.FC<ConsentFooterProps> = ({ onAccept, onDecline }) => {
  return (
    <DialogFooter className="sm:justify-between flex flex-col sm:flex-row gap-3 pt-2">
      <Link
        to="/datenschutz"
        target="_blank"
        className="inline-flex h-9 items-center justify-center rounded-xl border border-input bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Datenschutzrichtlinie
        <ExternalLink className="h-3 w-3 ml-1.5" />
      </Link>
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
