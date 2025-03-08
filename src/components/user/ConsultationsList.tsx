
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileClock, Eye, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock consultation data
const mockConsultations = [
  {
    id: 'CONS-2458',
    date: '20. Juli 2023',
    doctor: 'Dr. Schmidt',
    status: 'completed',
    type: 'Erstberatung',
    notes: 'Erstrezept für CBD Öl 5% ausgestellt.'
  },
  {
    id: 'CONS-1785',
    date: '5. August 2023',
    doctor: 'Dr. Schmidt',
    status: 'scheduled',
    type: 'Nachsorge',
    appointmentDate: '12. August 2023, 14:30 Uhr'
  },
  {
    id: 'CONS-3025',
    date: '15. Juni 2023',
    doctor: 'Dr. Schmidt',
    status: 'pending',
    type: 'Rezepterneuerung',
    notes: 'Anfrage für Rezepterneuerung gestellt.'
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
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
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
    </div>
  );
};

export default ConsultationsList;
