
import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { EventType } from './types';

interface NewEventDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newEventData: {
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    type: EventType;
    notes: string;
    patientName: string;
  };
  onDataChange: (data: any) => void;
  onCreateEvent: () => void;
}

const NewEventDialog: React.FC<NewEventDialogProps> = ({
  isOpen,
  onOpenChange,
  newEventData,
  onDataChange,
  onCreateEvent
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Neuen Termin erstellen</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">Titel *</label>
            <Input 
              id="title"
              value={newEventData.title}
              onChange={(e) => onDataChange({...newEventData, title: e.target.value})}
              placeholder="Termintitel"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Datum *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(newEventData.date, "PPP", { locale: de })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newEventData.date}
                    onSelect={(newDate) => newDate && onDataChange({...newEventData, date: newDate})}
                    className="p-3 pointer-events-auto"
                    locale={de}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">Termintyp *</label>
              <Select 
                onValueChange={(value) => onDataChange({
                  ...newEventData, 
                  type: value as EventType
                })}
                defaultValue={newEventData.type}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Termintyp auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="videoconsultation">Videosprechstunde</SelectItem>
                  <SelectItem value="appointment">Regulärer Termin</SelectItem>
                  <SelectItem value="prescription">Rezeptverwaltung</SelectItem>
                  <SelectItem value="patient">Patiententermin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium">Startzeit *</label>
              <Input 
                id="startTime"
                type="time"
                value={newEventData.startTime}
                onChange={(e) => onDataChange({...newEventData, startTime: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium">Endzeit *</label>
              <Input 
                id="endTime"
                type="time"
                value={newEventData.endTime}
                onChange={(e) => onDataChange({...newEventData, endTime: e.target.value})}
              />
            </div>
          </div>
          
          {(newEventData.type === 'videoconsultation' || newEventData.type === 'patient') && (
            <div className="space-y-2">
              <label htmlFor="patient" className="text-sm font-medium">Patient</label>
              <Input 
                id="patient"
                value={newEventData.patientName}
                onChange={(e) => onDataChange({...newEventData, patientName: e.target.value})}
                placeholder="Name des Patienten"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Notizen</label>
            <Textarea 
              id="notes"
              value={newEventData.notes}
              onChange={(e) => onDataChange({...newEventData, notes: e.target.value})}
              placeholder="Zusätzliche Informationen zum Termin"
              rows={3}
            />
          </div>
          
          <p className="text-xs text-muted-foreground">* Pflichtfelder</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={onCreateEvent}>Termin erstellen</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewEventDialog;
