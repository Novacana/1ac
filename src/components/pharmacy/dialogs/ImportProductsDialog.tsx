
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { toast } from "sonner";

interface ImportProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImportProductsDialog: React.FC<ImportProductsDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const handleImportSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success("Produkte wurden erfolgreich importiert");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Produkte importieren</DialogTitle>
          <DialogDescription>
            Laden Sie eine CSV- oder Excel-Datei mit Ihren Produktdaten hoch
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleImportSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="file-upload">Datei auswählen</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center hover:border-primary/50 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-1">
                  Datei hierher ziehen oder klicken zum Auswählen
                </p>
                <Input 
                  id="file-upload" 
                  type="file" 
                  accept=".csv,.xlsx,.xls" 
                  className="sr-only"
                />
                <Button type="button" variant="outline" size="sm">
                  Datei auswählen
                </Button>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Unterstützte Dateiformate: CSV, Excel (.xlsx, .xls)</p>
              <p>Die Datei sollte folgende Spalten enthalten: Name, Kategorie, Preis, Bestand</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Abbrechen
            </Button>
            <Button type="submit">Importieren</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImportProductsDialog;
