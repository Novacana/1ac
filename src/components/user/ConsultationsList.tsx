
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileClock, Eye, MessageCircle, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { isGDPRCompliant, isHIPAACompliant } from '@/utils/fhirCompliance';

// Mock consultation data
const mockConsultations = [
  {
    id: 'CONS-2458',
    date: '20. Juli 2023',
    doctor: 'Dr. Schmidt',
    status: 'completed',
    type: 'Erstberatung',
    notes: 'Erstrezept für CBD Öl 5% ausgestellt.',
    doctorSpecialty: 'Allgemeinmedizin',
    duration: '25 Minuten',
    summary: 'Ausführliche Erstberatung zu cannabisbasierten Therapiemöglichkeiten. Patient berichtet über chronische Schmerzen. Empfehlung für CBD Öl 5% mit anfänglich niedriger Dosierung.'
  },
  {
    id: 'CONS-1785',
    date: '5. August 2023',
    doctor: 'Dr. Schmidt',
    status: 'scheduled',
    type: 'Nachsorge',
    appointmentDate: '12. August 2023, 14:30 Uhr',
    doctorSpecialty: 'Allgemeinmedizin',
    duration: '15 Minuten',
    summary: 'Folgetermin zur Überprüfung des Therapieverlaufs und ggf. Anpassung der Dosierung.'
  },
  {
    id: 'CONS-3025',
    date: '15. Juni 2023',
    doctor: 'Dr. Schmidt',
    status: 'pending',
    type: 'Rezepterneuerung',
    notes: 'Anfrage für Rezepterneuerung gestellt.',
    doctorSpecialty: 'Allgemeinmedizin',
    duration: 'N/A',
    summary: 'Anfrage zur Erneuerung des bestehenden Rezepts für CBD Öl 5%. Patient berichtet über gute Verträglichkeit und Wirksamkeit.'
  }
];

// Status badge mapping
const getStatusBadge = (status) => {
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

const ConsultationsList = () => {
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  const handleViewDetails = (consultation) => {
    // Check GDPR and HIPAA compliance before showing medical data
    if (isGDPRCompliant(consultation) && isHIPAACompliant(consultation)) {
      setSelectedConsultation(consultation);
      setDetailsOpen(true);
    } else {
      console.error("Compliance check failed for medical data");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meine Beratungen</h2>
        <Button>Neue Beratung anfordern</Button>
      </div>
      
      {mockConsultations.length > 0 ? (
        <div className="space-y-4">
          {mockConsultations.map((consultation) => (
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
                      onClick={() => handleViewDetails(consultation)}
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
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <div className="py-10 space-y-4">
            <div className="flex justify-center">
              <FileClock className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Keine Beratungen gefunden</h3>
            <p className="text-muted-foreground">
              Sie haben noch keine Beratungen angefordert.
            </p>
            <Button>Beratung anfordern</Button>
          </div>
        </Card>
      )}

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedConsultation?.id} - {selectedConsultation?.type}</DialogTitle>
            <DialogDescription>
              Erstellt am {selectedConsultation?.date}
            </DialogDescription>
          </DialogHeader>
          
          {selectedConsultation && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                {getStatusBadge(selectedConsultation.status)}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div>
                  <h4 className="text-sm text-muted-foreground">Arzt</h4>
                  <p className="font-medium">{selectedConsultation.doctor}</p>
                </div>
                
                <div>
                  <h4 className="text-sm text-muted-foreground">Fachgebiet</h4>
                  <p>{selectedConsultation.doctorSpecialty}</p>
                </div>
                
                {selectedConsultation.appointmentDate && (
                  <div>
                    <h4 className="text-sm text-muted-foreground">Termin</h4>
                    <p>{selectedConsultation.appointmentDate}</p>
                  </div>
                )}
                
                <div>
                  <h4 className="text-sm text-muted-foreground">Dauer</h4>
                  <p>{selectedConsultation.duration}</p>
                </div>
              </div>
              
              {selectedConsultation.summary && (
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Zusammenfassung</h4>
                  <p className="text-sm">{selectedConsultation.summary}</p>
                </div>
              )}
              
              {selectedConsultation.notes && (
                <div>
                  <h4 className="text-sm text-muted-foreground mb-1">Notizen</h4>
                  <p className="text-sm">{selectedConsultation.notes}</p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDetailsOpen(false)}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Schließen
            </Button>
            
            {selectedConsultation?.status === 'scheduled' && (
              <Button className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Zum Videochat
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConsultationsList;
