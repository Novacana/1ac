
import React from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const DocumentsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Approbationsnachweise</h3>
      <div className="bg-muted/30 rounded-lg p-6 border">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <div className="mx-auto flex flex-col items-center justify-center gap-1">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-2">
              Ziehen Sie Ihre Approbationsurkunde hierher oder klicken Sie zum Hochladen
            </p>
            <p className="text-xs text-muted-foreground/70">
              PDF, JPG oder PNG (max. 10MB)
            </p>
            <Button className="mt-4">
              Datei auswählen
            </Button>
          </div>
        </div>
      </div>
      
      <h3 className="text-lg font-medium mt-6">Facharztnachweise</h3>
      <div className="bg-muted/30 rounded-lg p-6 border">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
          <div className="mx-auto flex flex-col items-center justify-center gap-1">
            <FileText className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-2">
              Ziehen Sie Ihre Facharztanerkennung hierher oder klicken Sie zum Hochladen
            </p>
            <p className="text-xs text-muted-foreground/70">
              PDF, JPG oder PNG (max. 10MB)
            </p>
            <Button className="mt-4">
              Datei auswählen
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
