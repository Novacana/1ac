
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { getStatusBadge } from './ConsultationCard';

interface ConsultationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  consultation: any | null;
}

const ConsultationDetailsDialog: React.FC<ConsultationDetailsDialogProps> = ({
  open,
  onOpenChange,
  consultation
}) => {
  if (!consultation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{consultation?.id} - {consultation?.type}</DialogTitle>
          <DialogDescription>
            Erstellt am {consultation?.date}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Status:</span>
            {getStatusBadge(consultation.status)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
            <div>
              <h4 className="text-sm text-muted-foreground">Arzt</h4>
              <p className="font-medium">{consultation.doctor}</p>
            </div>
            
            <div>
              <h4 className="text-sm text-muted-foreground">Fachgebiet</h4>
              <p>{consultation.doctorSpecialty}</p>
            </div>
            
            {consultation.appointmentDate && (
              <div>
                <h4 className="text-sm text-muted-foreground">Termin</h4>
                <p>{consultation.appointmentDate}</p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm text-muted-foreground">Dauer</h4>
              <p>{consultation.duration}</p>
            </div>
          </div>
          
          {consultation.summary && (
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Zusammenfassung</h4>
              <p className="text-sm">{consultation.summary}</p>
            </div>
          )}
          
          {consultation.notes && (
            <div>
              <h4 className="text-sm text-muted-foreground mb-1">Notizen</h4>
              <p className="text-sm">{consultation.notes}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Schließen
          </Button>
          
          {consultation?.status === 'scheduled' && (
            <Button className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Zum Videochat
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDetailsDialog;
