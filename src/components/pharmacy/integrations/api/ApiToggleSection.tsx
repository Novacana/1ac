
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ApiToggleSectionProps {
  apiEnabled: boolean;
  setApiEnabled: (value: boolean) => void;
}

const ApiToggleSection: React.FC<ApiToggleSectionProps> = ({ apiEnabled, setApiEnabled }) => {
  const [showGdprInfo, setShowGdprInfo] = React.useState(false);

  const handleToggleChange = (checked: boolean) => {
    if (checked && !apiEnabled) {
      // Only show GDPR info when enabling the API
      setShowGdprInfo(true);
    } else {
      // When disabling, no need for GDPR confirmation
      setApiEnabled(checked);
    }
  };

  const handleConfirmGdpr = () => {
    setApiEnabled(true);
    setShowGdprInfo(false);
  };

  return (
    <>
      <div className="flex items-center justify-between space-x-2 mt-4 bg-muted/50 p-3 rounded-md">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-muted-foreground" />
          <Label htmlFor="enable-api">API aktivieren</Label>
        </div>
        <Switch 
          id="enable-api" 
          checked={apiEnabled}
          onCheckedChange={handleToggleChange}
        />
      </div>

      <Dialog open={showGdprInfo} onOpenChange={setShowGdprInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>DSGVO-Hinweis zur API-Aktivierung</DialogTitle>
            <DialogDescription>
              Durch die Aktivierung der API können personenbezogene Daten über diese Schnittstelle verarbeitet werden. 
              Gemäß der Datenschutz-Grundverordnung (DSGVO) müssen Sie sicherstellen, dass:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <ul className="list-disc pl-5 space-y-2">
              <li>Sie eine rechtmäßige Grundlage für die Verarbeitung haben</li>
              <li>Die Datenverarbeitung den Grundsätzen der DSGVO entspricht</li>
              <li>Betroffene Personen über die Verarbeitung informiert werden</li>
              <li>Geeignete technische und organisatorische Maßnahmen implementiert sind</li>
            </ul>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGdprInfo(false)}>Abbrechen</Button>
            <Button onClick={handleConfirmGdpr}>Ich bestätige und aktiviere die API</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ApiToggleSection;
