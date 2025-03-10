
import React from "react";
import { Button } from "@/components/ui/button";

interface DialogActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSaveDisabled: boolean;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  onSave,
  onCancel,
  isSaveDisabled,
}) => {
  return (
    <div className="gap-3 flex flex-col sm:flex-row-reverse">
      <Button 
        onClick={onSave} 
        disabled={isSaveDisabled}
        className="rounded-xl bg-green-500 hover:bg-green-600 transition-colors"
      >
        Speichern
      </Button>
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="rounded-xl"
      >
        Abbrechen
      </Button>
    </div>
  );
};

export default DialogActions;
