
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NotesFieldProps {
  notes: string;
  setNotes: (value: string) => void;
}

const NotesField: React.FC<NotesFieldProps> = ({ notes, setNotes }) => {
  return (
    <div className="grid grid-cols-4 items-start gap-4">
      <Label htmlFor="notes" className="text-right pt-2">
        Notizen
      </Label>
      <Textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Zusätzliche Informationen zur Integration..."
        className="col-span-3 rounded-lg resize-none"
        rows={3}
      />
    </div>
  );
};

export default NotesField;
