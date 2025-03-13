
import React, { memo } from 'react';
import { PrescriptionRequest } from '@/types/prescription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Inbox, AlertCircle, ShieldAlert } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PrescriptionRequestsListProps {
  requests: PrescriptionRequest[];
  loading: boolean;
  selectedRequestId: string | null;
  onSelectRequest: (id: string) => void;
}

// Optimize rendering with React.memo
const RequestItem = memo(({ 
  request, 
  isSelected, 
  onSelect 
}: { 
  request: PrescriptionRequest, 
  isSelected: boolean, 
  onSelect: () => void 
}) => {
  // Status badge formatter
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

  // Date formatter
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Truncate and anonymize patient data for display
  const getAnonymizedName = (name: string) => {
    // Only show first two letters of first name and last name initial for GDPR compliance
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0].substring(0, 2)}... ${nameParts[nameParts.length - 1].charAt(0)}.`;
    }
    return `${name.substring(0, 2)}...`;
  };

  return (
    <div
      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
        isSelected ? 'bg-muted' : ''
      }`}
      onClick={onSelect}
      data-testid="prescription-request-item"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium flex items-center">
          {request.patientName}
          <Tooltip>
            <TooltipTrigger asChild>
              <ShieldAlert className="h-4 w-4 ml-2 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">DSGVO/HIPAA-geschützte Daten</p>
            </TooltipContent>
          </Tooltip>
        </div>
        {getStatusBadge(request.status)}
      </div>
      
      <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
        {request.symptoms}
      </div>
      
      <div className="text-xs text-muted-foreground">
        Eingereicht am {formatDate(request.dateSubmitted)}
      </div>
    </div>
  );
});

RequestItem.displayName = 'RequestItem';

const PrescriptionRequestsList: React.FC<PrescriptionRequestsListProps> = memo(({
  requests,
  loading,
  selectedRequestId,
  onSelectRequest
}) => {
  return (
    <Card className="h-full">
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
                <RequestItem 
                  key={request.id}
                  request={request}
                  isSelected={selectedRequestId === request.id}
                  onSelect={() => onSelectRequest(request.id)}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
});

PrescriptionRequestsList.displayName = 'PrescriptionRequestsList';

export default PrescriptionRequestsList;
