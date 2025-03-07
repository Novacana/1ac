
import React from 'react';
import { FilePen, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface PrescriptionTabProps {
  status: 'pending' | 'approved' | 'rejected' | 'needs_more_info';
  prescription: {
    id: string;
    product: string;
    dosage: string;
    duration: string;
    instructions: string;
    dateIssued: string;
    expiryDate: string;
  };
  onPrescriptionChange: (field: string, value: string) => void;
  onStatusChange: () => void;
}

const PrescriptionTab: React.FC<PrescriptionTabProps> = ({
  status,
  prescription,
  onPrescriptionChange,
  onStatusChange
}) => {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FilePen className="h-5 w-5 text-primary" />
        <div className="font-medium text-lg">Rezept ausstellen</div>
      </div>
      
      {status === 'approved' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produkt</Label>
            <Input
              id="product"
              value={prescription.product}
              onChange={(e) => onPrescriptionChange('product', e.target.value)}
              placeholder="z.B. CBD-Öl 5%"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosierung</Label>
            <Input
              id="dosage"
              value={prescription.dosage}
              onChange={(e) => onPrescriptionChange('dosage', e.target.value)}
              placeholder="z.B. 10mg, 2x täglich"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Dauer</Label>
            <Input
              id="duration"
              value={prescription.duration}
              onChange={(e) => onPrescriptionChange('duration', e.target.value)}
              placeholder="z.B. 3 Monate"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions">Anweisungen</Label>
            <Textarea
              id="instructions"
              value={prescription.instructions}
              onChange={(e) => onPrescriptionChange('instructions', e.target.value)}
              placeholder="z.B. 5 Tropfen morgens und abends unter die Zunge"
              className="min-h-[80px]"
            />
          </div>
        </div>
      ) : (
        <div className="p-6 border rounded-md text-center bg-muted/10">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            Um ein Rezept auszustellen, setzen Sie den Status auf "Genehmigt"
          </p>
          <div className="mt-4">
            <Button 
              variant="outline"
              onClick={onStatusChange}
            >
              Status auf "Genehmigt" setzen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionTab;
