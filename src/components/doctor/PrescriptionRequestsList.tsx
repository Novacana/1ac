
import React from 'react';
import { PrescriptionRequest } from '@/types/prescription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Inbox, AlertCircle } from 'lucide-react';

interface PrescriptionRequestsListProps {
  requests: PrescriptionRequest[];
  loading: boolean;
  selectedRequestId: string | null;
  onSelectRequest: (id: string) => void;
}

const PrescriptionRequestsList: React.FC<PrescriptionRequestsListProps> = ({
  requests,
  loading,
  selectedRequestId,
  onSelectRequest
}) => {
  // Statuskennzeichnung formatieren
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Ausstehend</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Genehmigt</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Abgelehnt</Badge>;
      case 'needs_more_info':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Info benötigt</Badge>;
      default:
        return <Badge variant="outline">Unbekannt</Badge>;
    }
  };

  // Datum formatieren
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Inbox className="h-5 w-5" />
          Rezeptanfragen
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
            <p className="mt-2 text-muted-foreground">Keine Anfragen gefunden</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px]">
            <div className="divide-y">
              {requests.map(request => (
                <div
                  key={request.id}
                  className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                    selectedRequestId === request.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => onSelectRequest(request.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">{request.patientName}</div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {request.symptoms}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    Eingereicht am {formatDate(request.dateSubmitted)}
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

export default PrescriptionRequestsList;
