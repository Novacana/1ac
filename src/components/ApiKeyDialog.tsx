
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (apiKey: string) => void;
}

export function ApiKeyDialog({ open, onClose, onSave }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API-Schlüssel erforderlich",
        description: "Bitte gib einen gültigen API-Schlüssel ein.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("elevenlabsApiKey", apiKey);
    onSave(apiKey);
    onClose();
    
    toast({
      title: "API-Schlüssel gespeichert",
      description: "Dein ElevenLabs API-Schlüssel wurde erfolgreich gespeichert.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ElevenLabs API-Schlüssel</DialogTitle>
          <DialogDescription>
            Gib deinen ElevenLabs API-Schlüssel ein, um die Sprachausgabe zu aktivieren. 
            Der Schlüssel wird sicher in deinem Browser gespeichert.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Dein API-Schlüssel..."
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button onClick={handleSave}>Speichern</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
