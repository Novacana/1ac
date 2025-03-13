
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle } from 'lucide-react';

// Status badge mapping
export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500 hover:bg-green-600">Abgeschlossen</Badge>;
    case 'scheduled':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Geplant</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Ausstehend</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500 hover:bg-red-600">Storniert</Badge>;
    default:
      return <Badge>Unbekannt</Badge>;
  }
};

interface ConsultationCardProps {
  consultation: any;
  onViewDetails: (consultation: any) => void;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ 
  consultation, 
  onViewDetails 
}) => {
  return (
    <Card key={consultation.id} className="overflow-hidden">
      <CardHeader className="py-4 px-6 bg-muted/30 border-b">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <CardTitle className="text-base font-medium">{consultation.id} - {consultation.type}</CardTitle>
            <CardDescription>Erstellt am {consultation.date}</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(consultation.status)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-muted-foreground">Arzt</h4>
              <p className="font-medium">{consultation.doctor}</p>
            </div>
            
            {consultation.appointmentDate && (
              <div>
                <h4 className="text-sm text-muted-foreground">Termin</h4>
                <p className="font-medium">{consultation.appointmentDate}</p>
              </div>
            )}
            
            {consultation.notes && (
              <div className="md:col-span-2">
                <h4 className="text-sm text-muted-foreground">Notizen</h4>
                <p>{consultation.notes}</p>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => onViewDetails(consultation)}
            >
              <Eye className="h-4 w-4" />
              Details
            </Button>
            {consultation.status === 'scheduled' && (
              <Button size="sm" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Zum Videochat
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsultationCard;
