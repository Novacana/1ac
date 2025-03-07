
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Info } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const PrescriptionForm = () => {
  const [prescriptionNumber, setPrescriptionNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simuliere einen Upload
      setIsUploading(true);
      setUploadProgress(0);
      
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
    }
  };

  return (
    <div className="space-y-4 mt-4 p-4 rounded-md bg-background border">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prescriptionNumber">Rezeptnummer</Label>
          <Input
            id="prescriptionNumber"
            placeholder="z.B. R12345678"
            value={prescriptionNumber}
            onChange={(e) => setPrescriptionNumber(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Geben Sie die Nummer Ihres Cannabis-Rezepts ein
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="prescriptionUpload">Rezept hochladen (optional)</Label>
          <div className="border rounded-md p-4 flex flex-col items-center justify-center bg-muted/30 cursor-pointer">
            <input
              type="file"
              id="prescriptionUpload"
              className="hidden"
              accept="image/*, application/pdf"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="prescriptionUpload"
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-6 w-6 mb-2 text-primary" />
              <span className="text-sm font-medium text-center">
                Klicken Sie hier, um Ihr Rezept hochzuladen
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                PDF, JPG oder PNG (max. 5MB)
              </span>
            </label>
          </div>
          {isUploading && (
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-primary">
              <Info className="h-4 w-4" />
              <span>{isOpen ? "Weniger Informationen" : "Mehr Informationen"}</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 text-sm text-muted-foreground bg-muted/20 p-3 rounded">
            <p>
              Ein gültiges Cannabis-Rezept muss folgende Informationen enthalten:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Name des Patienten</li>
              <li>Verschriebenes Produkt und Menge</li>
              <li>Unterschrift des Arztes</li>
              <li>Stempel der ausstellenden Praxis</li>
              <li>Ausstellungsdatum (nicht älter als 7 Tage)</li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default PrescriptionForm;
