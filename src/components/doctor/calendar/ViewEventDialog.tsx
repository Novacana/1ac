
import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarEvent, PatientRecord } from './types';
import { getEventTypeIcon, getRecordTypeIcon } from './utils';
import { cn } from '@/lib/utils';
import { Video } from 'lucide-react';

interface ViewEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentEvent: CalendarEvent | null;
  patientRecords: PatientRecord[];
  showPatientBriefing: boolean;
  onTogglePatientBriefing: () => void;
  onDeleteEvent: (eventId: string) => void;
}

const ViewEventDialog: React.FC<ViewEventDialogProps> = ({
  isOpen,
  onOpenChange,
  currentEvent,
  patientRecords,
  showPatientBriefing,
  onTogglePatientBriefing,
  onDeleteEvent
}) => {
  if (!currentEvent) return null;

  const getEventTypeName = (type: string) => {
    switch (type) {
      case 'videoconsultation': return "Videosprechstunde";
      case 'appointment': return "Regulärer Termin";
      case 'prescription': return "Rezeptverwaltung";
      case 'patient': return "Patiententermin";
      default: return type;
    }
  };

  const getEventTypeClass = (type: string) => {
    switch (type) {
      case 'videoconsultation': return "bg-green-500";
      case 'appointment': return "bg-blue-500";
      case 'prescription': return "bg-yellow-500";
      case 'patient': return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentEvent.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Datum</h3>
              <p>{format(currentEvent.date, "PPP", { locale: de })}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Zeit</h3>
              <p>{currentEvent.startTime} - {currentEvent.endTime}</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium">Typ</h3>
            <div className="flex items-center mt-1">
              <Badge className={cn(
                "flex items-center",
                getEventTypeClass(currentEvent.type)
              )}>
                {getEventTypeIcon(currentEvent.type)}
                <span className="ml-1">
                  {getEventTypeName(currentEvent.type)}
                </span>
              </Badge>
            </div>
          </div>
          
          {currentEvent.patientName && (
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Patient</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 text-xs"
                  onClick={onTogglePatientBriefing}
                >
                  {showPatientBriefing ? 'Patientenbriefing ausblenden' : 'Patientenbriefing anzeigen'}
                  <ChevronDown className={cn(
                    "h-4 w-4 transition-transform",
                    showPatientBriefing && "rotate-180"
                  )} />
                </Button>
              </div>
              <p className="mt-1">{currentEvent.patientName}</p>
              
              {/* Patient Briefing Section */}
              {showPatientBriefing && (
                <div className="mt-4 border rounded-md p-4 bg-slate-50">
                  <h4 className="font-medium mb-2">Patientenbriefing</h4>
                  
                  {patientRecords.length > 0 ? (
                    <div className="space-y-3">
                      {patientRecords.map(record => (
                        <div key={record.id} className="border-l-2 border-primary pl-3 py-1">
                          <div className="flex items-center gap-2">
                            {getRecordTypeIcon(record.type)}
                            <span className="font-medium text-sm">{record.title}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {format(record.date, "dd.MM.yyyy")}
                            </span>
                          </div>
                          <p className="text-sm mt-1">{record.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Keine Patientendaten vorhanden.</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          {currentEvent.notes && (
            <div>
              <h3 className="text-sm font-medium">Notizen</h3>
              <p className="mt-1">{currentEvent.notes}</p>
            </div>
          )}

          {currentEvent.type === 'videoconsultation' && (
            <div className="flex justify-center mt-4">
              <Button className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                Videosprechstunde starten
              </Button>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between">
          <Button 
            variant="destructive" 
            onClick={() => onDeleteEvent(currentEvent.id)}
          >
            Termin löschen
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewEventDialog;
