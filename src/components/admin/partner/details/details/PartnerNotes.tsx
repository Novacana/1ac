
import React from "react";
import { Label } from "@/components/ui/label";
import { Partner } from "../../../PartnerConfig";

interface PartnerNotesProps {
  partner: Partner;
  onInputChange: (field: keyof Partner, value: string | boolean) => void;
}

export const PartnerNotes: React.FC<PartnerNotesProps> = ({ 
  partner, 
  onInputChange 
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notizen</Label>
      <textarea 
        id="notes"
        className="w-full min-h-24 border border-input rounded-md px-3 py-2"
        value={partner.notes || ""}
        onChange={(e) => onInputChange('notes', e.target.value)}
      />
    </div>
  );
};
