
import React from 'react';
import { PrescriptionRequest } from '@/types/prescription';
import { User, MessageSquare, Calendar, HelpCircle } from 'lucide-react';
import { formatDate } from '@/utils/prescriptionUtils';

interface PatientDetailsTabProps {
  request: PrescriptionRequest;
}

const PatientDetailsTab: React.FC<PatientDetailsTabProps> = ({ request }) => {
  return (
    <div className="p-6 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div className="font-medium">Patient</div>
        </div>
        <div className="pl-6 text-lg">{request.patientName}</div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <div className="font-medium">Kontakt</div>
        </div>
        <div className="pl-6">
          <div>{request.patientEmail}</div>
          {request.patientPhone && <div>{request.patientPhone}</div>}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <div className="font-medium">Eingereicht am</div>
        </div>
        <div className="pl-6">{formatDate(request.dateSubmitted)}</div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          <div className="font-medium">Fragebogen</div>
        </div>
        <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between gap-2 bg-muted/20 p-2 rounded">
            <span>Chronische Schmerzen:</span>
            <span className="font-medium">{request.questionnaire.pain === 'yes' ? 'Ja' : 'Nein'}</span>
          </div>
          <div className="flex justify-between gap-2 bg-muted/20 p-2 rounded">
            <span>Schlafprobleme:</span>
            <span className="font-medium">{request.questionnaire.sleep === 'yes' ? 'Ja' : 'Nein'}</span>
          </div>
          <div className="flex justify-between gap-2 bg-muted/20 p-2 rounded">
            <span>Angstzustände:</span>
            <span className="font-medium">{request.questionnaire.anxiety === 'yes' ? 'Ja' : 'Nein'}</span>
          </div>
          <div className="flex justify-between gap-2 bg-muted/20 p-2 rounded">
            <span>Vorbehandlungen:</span>
            <span className="font-medium">{request.questionnaire.previous_treatment === 'yes' ? 'Ja' : 'Nein'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailsTab;
