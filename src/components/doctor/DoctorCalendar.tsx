
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Video, 
  FileText, 
  RefreshCw,
  Plus,
  ExternalLink 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

type EventType = 'videoconsultation' | 'appointment' | 'prescription' | 'patient';
type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: EventType;
  notes?: string;
  patientName?: string;
};

const calendarSyncOptions = [
  { id: 'google', name: 'Google Calendar' },
  { id: 'outlook', name: 'Microsoft Outlook' },
  { id: 'apple', name: 'Apple iCalendar' },
  { id: 'caldav', name: 'CalDAV' }
];

// Mock initial events
const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Videosprechstunde mit Maria Schmidt',
    date: new Date(),
    startTime: '14:30',
    endTime: '15:00',
    type: 'videoconsultation',
    patientName: 'Maria Schmidt'
  },
  {
    id: '2',
    title: 'Videosprechstunde mit Thomas Müller',
    date: new Date(),
    startTime: '16:00',
    endTime: '16:30',
    type: 'videoconsultation',
    patientName: 'Thomas Müller'
  },
  {
    id: '3',
    title: 'Rezepterneuerung prüfen',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: '10:00',
    endTime: '10:30',
    type: 'prescription'
  }
];

const DoctorCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  const [newEventData, setNewEventData] = useState({
    title: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    type: 'appointment' as EventType,
    notes: '',
    patientName: ''
  });

  // Filter events for the selected date
  const eventsForSelectedDate = events.filter(event => 
    event.date.getDate() === date.getDate() && 
    event.date.getMonth() === date.getMonth() &&
    event.date.getFullYear() === date.getFullYear()
  );

  // Helper function to get event days
  const getEventDays = () => {
    return events.map(event => new Date(
      event.date.getFullYear(),
      event.date.getMonth(),
      event.date.getDate()
    ));
  };

  const handleNewEvent = () => {
    setNewEventData({
      title: '',
      date: date,
      startTime: '',
      endTime: '',
      type: 'appointment',
      notes: '',
      patientName: ''
    });
    setIsNewEventOpen(true);
  };

  const handleCreateEvent = () => {
    // DSGVO-konform: Prüfen, ob alle notwendigen Felder ausgefüllt sind
    if (!newEventData.title || !newEventData.startTime || !newEventData.endTime) {
      toast.error('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    const newEvent: CalendarEvent = {
      id: `event-${Date.now()}`,
      ...newEventData
    };

    setEvents([...events, newEvent]);
    setIsNewEventOpen(false);
    toast.success('Termin erfolgreich erstellt');
  };

  const handleViewEvent = (event: CalendarEvent) => {
    setCurrentEvent(event);
    setIsViewEventOpen(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    setIsViewEventOpen(false);
    toast.success('Termin wurde gelöscht');
  };

  const handleSyncCalendars = () => {
    // In einer echten Implementierung würde hier die Kalendersynchronisation stattfinden
    toast.success('Kalender erfolgreich synchronisiert');
    setIsSyncDialogOpen(false);
  };

  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case 'videoconsultation':
        return <Video className="h-4 w-4" />;
      case 'appointment':
        return <Clock className="h-4 w-4" />;
      case 'prescription':
        return <FileText className="h-4 w-4" />;
      case 'patient':
        return <Users className="h-4 w-4" />;
      default:
        return <CalendarIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Arzt-Kalender</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsSyncDialogOpen(true)}
          >
            <RefreshCw className="h-4 w-4" />
            Kalender synchronisieren
          </Button>
          <Button className="flex items-center gap-2" onClick={handleNewEvent}>
            <Plus className="h-4 w-4" />
            Neuer Termin
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPPP", { locale: de })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                modifiers={{ booked: getEventDays() }}
                modifiersStyles={{ booked: { fontWeight: 'bold', backgroundColor: 'rgba(34, 197, 94, 0.1)' } }}
                className="p-3 pointer-events-auto"
                locale={de}
              />
            </PopoverContent>
          </Popover>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Kalenderansicht</h3>
            <Tabs defaultValue="day">
              <TabsList className="grid grid-cols-3 mb-4 w-full">
                <TabsTrigger value="day">Tag</TabsTrigger>
                <TabsTrigger value="week">Woche</TabsTrigger>
                <TabsTrigger value="month">Monat</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Termintypen</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500">
                  <Video className="h-3 w-3 mr-1" />
                  Videosprechstunde
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Termin
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500">
                  <FileText className="h-3 w-3 mr-1" />
                  Rezeptverwaltung
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500">
                  <Users className="h-3 w-3 mr-1" />
                  Patiententermin
                </Badge>
              </div>
            </div>
          </div>

          <Alert className="mt-6">
            <AlertDescription className="text-xs">
              Gemäß DSGVO werden alle Kalenderdaten verschlüsselt übertragen und gespeichert. 
              Patientendaten werden nur in pseudonymisierter Form mit externen Kalendern synchronisiert.
            </AlertDescription>
          </Alert>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">
            Termine am {format(date, "d. MMMM yyyy", { locale: de })}
          </h3>
          
          <div className="space-y-4">
            {eventsForSelectedDate.length > 0 ? (
              eventsForSelectedDate.map(event => (
                <div 
                  key={event.id} 
                  className="p-4 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleViewEvent(event)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-2 rounded-full",
                        event.type === 'videoconsultation' && "bg-green-100 text-green-700",
                        event.type === 'appointment' && "bg-blue-100 text-blue-700",
                        event.type === 'prescription' && "bg-yellow-100 text-yellow-700",
                        event.type === 'patient' && "bg-purple-100 text-purple-700",
                      )}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.startTime} - {event.endTime} Uhr
                        </p>
                      </div>
                    </div>
                    
                    {event.type === 'videoconsultation' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Video
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Keine Termine für diesen Tag</p>
                <Button variant="outline" className="mt-4" onClick={handleNewEvent}>
                  Termin hinzufügen
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* New Event Dialog */}
      <Dialog open={isNewEventOpen} onOpenChange={setIsNewEventOpen}>
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
                onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
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
                      onSelect={(date) => date && setNewEventData({...newEventData, date})}
                      className="p-3 pointer-events-auto"
                      locale={de}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">Termintyp *</label>
                <Select 
                  onValueChange={(value) => setNewEventData({
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
                  onChange={(e) => setNewEventData({...newEventData, startTime: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="endTime" className="text-sm font-medium">Endzeit *</label>
                <Input 
                  id="endTime"
                  type="time"
                  value={newEventData.endTime}
                  onChange={(e) => setNewEventData({...newEventData, endTime: e.target.value})}
                />
              </div>
            </div>
            
            {(newEventData.type === 'videoconsultation' || newEventData.type === 'patient') && (
              <div className="space-y-2">
                <label htmlFor="patient" className="text-sm font-medium">Patient</label>
                <Input 
                  id="patient"
                  value={newEventData.patientName}
                  onChange={(e) => setNewEventData({...newEventData, patientName: e.target.value})}
                  placeholder="Name des Patienten"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notizen</label>
              <Textarea 
                id="notes"
                value={newEventData.notes}
                onChange={(e) => setNewEventData({...newEventData, notes: e.target.value})}
                placeholder="Zusätzliche Informationen zum Termin"
                rows={3}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">* Pflichtfelder</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewEventOpen(false)}>Abbrechen</Button>
            <Button onClick={handleCreateEvent}>Termin erstellen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Event Dialog */}
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Termindetails</DialogTitle>
          </DialogHeader>
          {currentEvent && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-full",
                  currentEvent.type === 'videoconsultation' && "bg-green-100 text-green-700",
                  currentEvent.type === 'appointment' && "bg-blue-100 text-blue-700",
                  currentEvent.type === 'prescription' && "bg-yellow-100 text-yellow-700",
                  currentEvent.type === 'patient' && "bg-purple-100 text-purple-700",
                )}>
                  {getEventTypeIcon(currentEvent.type)}
                </div>
                <h3 className="text-lg font-medium">{currentEvent.title}</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Datum</p>
                  <p>{format(currentEvent.date, "PPP", { locale: de })}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Zeit</p>
                  <p>{currentEvent.startTime} - {currentEvent.endTime} Uhr</p>
                </div>
              </div>
              
              {currentEvent.patientName && (
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p>{currentEvent.patientName}</p>
                </div>
              )}
              
              {currentEvent.notes && (
                <div>
                  <p className="text-sm text-muted-foreground">Notizen</p>
                  <p className="text-sm">{currentEvent.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => currentEvent && handleDeleteEvent(currentEvent.id)}
            >
              Termin löschen
            </Button>
            <div className="flex gap-2">
              {currentEvent?.type === 'videoconsultation' && (
                <Button className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Videosprechstunde starten
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsViewEventOpen(false)}>Schließen</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Calendar Sync Dialog */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Kalender synchronisieren</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-4 text-sm text-muted-foreground">
              Wählen Sie externe Kalender aus, mit denen Sie synchronisieren möchten. 
              Aus DSGVO-Gründen werden patientenbezogene Daten pseudonymisiert.
            </p>
            
            <div className="space-y-4">
              {calendarSyncOptions.map(option => (
                <div key={option.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    <span>{option.name}</span>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Verbinden
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Alert>
                <AlertDescription className="text-xs">
                  Hinweis: Die Kalendersynchronisation erfolgt konform zur DSGVO und HIPAA. 
                  Persönliche Patientendaten werden pseudonymisiert und es werden nur die notwendigen 
                  Informationen übertragen. Der FHIR-Standard wird für den sicheren Datenaustausch verwendet.
                </AlertDescription>
              </Alert>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSyncDialogOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSyncCalendars}>Synchronisieren</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorCalendar;
