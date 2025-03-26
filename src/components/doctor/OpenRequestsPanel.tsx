
import React from 'react';
import { PrescriptionRequest } from '@/types/prescription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Inbox, AlertCircle, UserPlus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { convertToFHIRMedicationRequest, recordMedicationRequest } from '@/utils/fhir/resources/medicationRequest';

interface OpenRequestsPanelProps {
  requests: PrescriptionRequest[];
  loading: boolean;
  selectedRequestId: string | null;
  onSelectRequest: (id: string) => void;
  onAssignDoctor: (id: string) => Promise<{success: boolean, message?: string} | void>;
}

const OpenRequestsPanel: React.FC<OpenRequestsPanelProps> = ({
  requests,
  loading,
  selectedRequestId,
  onSelectRequest,
  onAssignDoctor
}) => {
  // Datum formatieren
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm');
  };

  const handleAssignRequest = async (requestId: string) => {
    try {
      // Übernehme den Patienten und ändere zum Rezept-Tab
      const result = await onAssignDoctor(requestId);
      
      // Check if result exists and has a success property before accessing it
      if (result && 'success' in result && result.success) {
        // Erstelle FHIR-konforme Ressource für GDPR-Compliance
        const request = requests.find(req => req.id === requestId);
        if (request) {
          const fhirRequest = convertToFHIRMedicationRequest({
            id: request.id,
            patientName: request.patientName,
            patientId: `patient-${requestId}`,
            requesterName: request.patientName,
            requesterId: `requester-${requestId}`,
            medicationName: request.cartItems?.[0]?.name || "Medikation",
            status: "pending"
          });
          
          console.log("FHIR MedicationRequest erstellt:", fhirRequest);
          
          // Protokolliere die Aktion für GDPR/HIPAA-Compliance
          await recordMedicationRequest('doctor-id', {
            id: request.id,
            medicationName: request.cartItems?.[0]?.name || "Medikation",
            patientId: `patient-${requestId}`
          });
        }
        
        toast.success('Patient erfolgreich übernommen. Rezept wird vorbereitet.');
      } else {
        toast.error('Fehler bei der Übernahme des Patienten');
      }
    } catch (error) {
      console.error("Fehler bei der Patientenübernahme:", error);
      toast.error('Fehler bei der Übernahme des Patienten');
    }
  };

  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          Offene Rezeptanfragen
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="mt-2 text-sm text-muted-foreground">Anfragen werden geladen...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">Keine offenen Anfragen vorhanden</p>
          </div>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="divide-y">
              {requests.map(request => (
                <div
                  key={request.id}
                  className="p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {request.patientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-medium">{request.patientName}</h3>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Neu
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {request.symptoms}
                      </p>
                      
                      <div className="flex items-center text-xs text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3 mr-1" />
                        Eingereicht am {formatDate(request.dateSubmitted)}
                      </div>
                      
                      <div className="mt-2 flex justify-end">
                        <Button 
                          size="sm"
                          onClick={() => handleAssignRequest(request.id)}
                          className="flex items-center gap-1"
                        >
                          <UserPlus className="h-4 w-4" />
                          Patient übernehmen
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default OpenRequestsPanel;
