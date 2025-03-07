
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { statusOptions } from '@/utils/prescriptionUtils';

interface SymptomsTabProps {
  symptoms: string;
  doctorNotes: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_more_info';
  onNotesChange: (notes: string) => void;
  onStatusChange: (status: string) => void;
}

const SymptomsTab: React.FC<SymptomsTabProps> = ({
  symptoms,
  doctorNotes,
  status,
  onNotesChange,
  onStatusChange
}) => {
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
          <div className="font-medium">Beschwerden & Symptome</div>
        </div>
        <div className="p-4 border rounded-md bg-muted/10 whitespace-pre-wrap">
          {symptoms}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="doctorNotes">Arztnotizen</Label>
        <Textarea
          id="doctorNotes"
          value={doctorNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Notizen zur Anfrage hinzufügen..."
          className="min-h-[120px]"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status aktualisieren</Label>
        <Select 
          value={status} 
          onValueChange={onStatusChange}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Status auswählen" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SymptomsTab;
