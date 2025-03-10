
import React from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldAlert } from "lucide-react";

const ConsentHeader: React.FC = () => {
  return (
    <DialogHeader className="flex items-start">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-5 w-5 text-primary" />
        <DialogTitle className="text-xl">Datenschutz-Einwilligung</DialogTitle>
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Gemäß der DSGVO (GDPR) benötigen wir Ihre Einwilligung, bevor wir eine Verbindung zu externen Diensten herstellen.
      </p>
    </DialogHeader>
  );
};

export default ConsentHeader;
