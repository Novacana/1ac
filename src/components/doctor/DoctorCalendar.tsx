
import React, { useState, useMemo } from 'react';
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
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ClipboardList,
  FileDigit,
  ScrollText,
  FileClock
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, getDay, isToday, setHours, setMinutes, getHours, getMinutes, addMonths, subMonths, startOfMonth, endOfMonth, isSameMonth, isSameDay } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";

type EventType = 'videoconsultation' | 'appointment' | 'prescription' | 'patient';
type CalendarView = 'day' | 'week' | 'month';
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

// Mock patient record data
type PatientRecordType = 'diagnosis' | 'prescription' | 'notes' | 'lab' | 'imaging';
type PatientRecord = {
  id: string;
  type: PatientRecordType;
  title: string;
  date: Date;
  content: string;
};

// Mock patient records
const getMockPatientRecords = (patientName: string): PatientRecord[] => {
  if (!patientName) return [];
  
  return [
    {
      id: '1',
      type: 'diagnosis',
      title: 'Erstdiagnose',
      date: new Date(2025, 2, 1), // March 1, 2025
      content: 'Chronische Migräne mit Aura. Patient berichtet über regelmäßige Anfälle 2-3 mal pro Monat.'
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Rezept Sumatriptan',
      date: new Date(2025, 2, 5), // March 5, 2025
      content: 'Sumatriptan 50mg, bei Bedarf, maximal 2 Tabletten in 24 Stunden.'
    },
    {
      id: '3',
      type: 'notes',
      title: 'Verlaufsgespräch',
      date: new Date(2025, 2, 10), // March 10, 2025
      content: 'Patient berichtet über leichte Verbesserung unter Sumatriptan, aber weiterhin Probleme mit Schlafqualität.'
    },
    {
      id: '4',
      type: 'lab',
      title: 'Blutbild',
      date: new Date(2025, 2, 12), // March 12, 2025
      content: 'Blutwerte im Normbereich. Vitamin D-Wert leicht erniedrigt (28 ng/ml).'
    },
    {
      id: '5',
      type: 'imaging',
      title: 'MRT Kopf',
      date: new Date(2025, 2, 15), // March 15, 2025
      content: 'Keine strukturellen Auffälligkeiten festgestellt, die auf sekundäre Kopfschmerzursachen hindeuten.'
    }
  ];
};

const getRecordTypeIcon = (type: PatientRecordType) => {
  switch (type) {
    case 'diagnosis':
      return <ClipboardList className="h-4 w-4" />;
    case 'prescription':
      return <FileText className="h-4 w-4" />;
    case 'notes':
      return <ScrollText className="h-4 w-4" />;
    case 'lab':
      return <FileDigit className="h-4 w-4" />;
    case 'imaging':
      return <FileClock className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const calendarSyncOptions = [
  { id: 'google', name: 'Google Calendar' },
  { id: 'outlook', name: 'Microsoft Outlook' },
  { id: 'apple', name: 'Apple iCalendar' },
  { id: 'caldav', name: 'CalDAV' }
];

// Mock initial events for testing
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
  },
  {
    id: '4',
    title: 'Patiententermin mit Sophia Weber',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: '09:00',
    endTime: '09:30',
    type: 'patient',
    patientName: 'Sophia Weber'
  },
  {
    id: '5',
    title: 'Regulärer Termin',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    startTime: '11:30',
    endTime: '12:00',
    type: 'appointment'
  },
  {
    id: '6',
    title: 'Videosprechstunde mit Hans Becker',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    startTime: '15:30',
    endTime: '16:00',
    type: 'videoconsultation',
    patientName: 'Hans Becker'
  }
];

// Helper function to convert time string to hours/minutes
const timeStringToDate = (timeStr: string, baseDate: Date): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours);
  date.setMinutes(minutes);
  return date;
};

const DoctorCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [view, setView] = useState<CalendarView>('day');
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [isViewEventOpen, setIsViewEventOpen] = useState(false);
  const [isSyncDialogOpen, setIsSyncDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CalendarEvent | null>(null);
  const [showPatientBriefing, setShowPatientBriefing] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: '',
    date: new Date(),
    startTime: '',
    endTime: '',
    type: 'appointment' as EventType,
    notes: '',
    patientName: ''
  });

  // Get patient records for current event
  const patientRecords = useMemo(() => {
    return currentEvent?.patientName ? getMockPatientRecords(currentEvent.patientName) : [];
  }, [currentEvent?.patientName]);

  // Generate days for week view
  const weekDays = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [date]);

  // Generate days for month view
  const monthDays = useMemo(() => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  }, [date]);

  // Navigation functions
  const navigatePrevious = () => {
    if (view === 'day') {
      setDate(prevDate => subDays(prevDate, 1));
    } else if (view === 'week') {
      setDate(prevDate => subWeeks(prevDate, 1));
    } else if (view === 'month') {
      setDate(prevDate => subMonths(prevDate, 1));
    }
  };

  const navigateNext = () => {
    if (view === 'day') {
      setDate(prevDate => addDays(prevDate, 1));
    } else if (view === 'week') {
      setDate(prevDate => addWeeks(prevDate, 1));
    } else if (view === 'month') {
      setDate(prevDate => addMonths(prevDate, 1));
    }
  };

  const navigateToday = () => {
    setDate(new Date());
  };

  // Filter events based on current view
  const filteredEvents = useMemo(() => {
    if (view === 'day') {
      return events.filter(event => 
        event.date.getDate() === date.getDate() && 
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
    } else if (view === 'week') {
      return events.filter(event => {
        const eventDay = new Date(event.date);
        return weekDays.some(day => 
          day.getDate() === eventDay.getDate() && 
          day.getMonth() === eventDay.getMonth() &&
          day.getFullYear() === eventDay.getFullYear()
        );
      });
    } else if (view === 'month') {
      return events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getMonth() === date.getMonth() &&
               eventDate.getFullYear() === date.getFullYear();
      });
    }
    return [];
  }, [events, date, view, weekDays]);

  // Get all days with events for the calendar highlight
  const getEventDays = () => {
    return events.map(event => new Date(
      event.date.getFullYear(),
      event.date.getMonth(),
      event.date.getDate()
    ));
  };

  const handleNewEvent = (selectedDate?: Date) => {
    setNewEventData({
      title: '',
      date: selectedDate || date,
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
    setShowPatientBriefing(false); // Reset patient briefing view
  };

  const togglePatientBriefing = () => {
    setShowPatientBriefing(!showPatientBriefing);
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

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'videoconsultation':
        return "bg-green-100 text-green-700 border-green-200";
      case 'appointment':
        return "bg-blue-100 text-blue-700 border-blue-200";
      case 'prescription':
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case 'patient':
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // Render time slots for day view (8AM to 6PM)
  const renderDayViewTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour <= 18; hour++) {
      const currentHour = `${hour}:00`;
      const eventsAtThisHour = filteredEvents.filter(event => {
        const [eventHour] = event.startTime.split(':').map(Number);
        return eventHour === hour;
      });

      timeSlots.push(
        <div key={hour} className="flex border-t py-2">
          <div className="w-20 text-sm text-muted-foreground pr-4 pt-2">{currentHour}</div>
          <div className="flex-1">
            {eventsAtThisHour.length > 0 ? (
              eventsAtThisHour.map(event => (
                <div 
                  key={event.id}
                  onClick={() => handleViewEvent(event)}
                  className={`px-3 py-2 mb-1 rounded cursor-pointer ${getEventTypeColor(event.type)} hover:opacity-90 transition-opacity`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getEventTypeIcon(event.type)}
                      <span className="font-medium">{event.title}</span>
                    </div>
                    <span className="text-xs">{event.startTime} - {event.endTime}</span>
                  </div>
                  {event.patientName && (
                    <p className="text-xs mt-1">Patient: {event.patientName}</p>
                  )}
                </div>
              ))
            ) : (
              <div 
                className="h-10 border border-dashed border-gray-200 rounded hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => {
                  const newDate = new Date(date);
                  newDate.setHours(hour);
                  newDate.setMinutes(0);
                  handleNewEvent(newDate);
                }}
              />
            )}
          </div>
        </div>
      );
    }
    return timeSlots;
  };

  // Render week view
  const renderWeekView = () => {
    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-1">
          {/* Days of week header */}
          {weekDays.map((day, index) => (
            <div key={index} className="text-center py-2 font-medium">
              <div className="text-xs text-muted-foreground mb-1">
                {format(day, 'EEE', { locale: de })}
              </div>
              <div className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm",
                isToday(day) && "bg-primary text-primary-foreground",
              )}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="mt-4 space-y-1">
          {Array.from({ length: 11 }).map((_, hourIndex) => {
            const hour = hourIndex + 8; // Start at 8 AM
            return (
              <div key={hourIndex} className="grid grid-cols-7 border-t pt-2">
                <div className="col-span-1 text-xs text-muted-foreground pr-2 pt-1">
                  {`${hour}:00`}
                </div>
                {weekDays.map((day, dayIndex) => {
                  const dayEvents = events.filter(event => {
                    const eventDate = new Date(event.date);
                    const [eventHour] = event.startTime.split(':').map(Number);
                    return isSameDay(eventDate, day) && eventHour === hour;
                  });

                  return (
                    <div 
                      key={dayIndex} 
                      className="col-span-1 min-h-[40px] px-1"
                      onClick={() => {
                        if (dayEvents.length === 0) {
                          const newDate = new Date(day);
                          newDate.setHours(hour);
                          newDate.setMinutes(0);
                          handleNewEvent(newDate);
                        }
                      }}
                    >
                      {dayEvents.length > 0 ? (
                        dayEvents.map(event => (
                          <div 
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewEvent(event);
                            }}
                            className={`text-xs p-1 rounded truncate cursor-pointer ${getEventTypeColor(event.type)} hover:opacity-90 transition-opacity`}
                          >
                            <div className="flex items-center gap-1">
                              {getEventTypeIcon(event.type)}
                              <span className="truncate">{event.title}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-10 border border-dashed border-gray-200 rounded-sm hover:bg-gray-50 transition-colors cursor-pointer" />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render month view
  const renderMonthView = () => {
    // Get start of the first week that contains the first day of the month
    const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
    // Get end of the last week that contains the last day of the month
    const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
    // All days to display in the calendar
    const allDays = eachDayOfInterval({ start, end });

    // Group days into weeks
    const weeks = [];
    let week = [];

    for (let i = 0; i < allDays.length; i++) {
      week.push(allDays[i]);
      if (week.length === 7 || i === allDays.length - 1) {
        weeks.push(week);
        week = [];
      }
    }

    return (
      <div className="mt-4">
        <div className="grid grid-cols-7 gap-1 text-center">
          <div className="text-xs font-medium">Mo</div>
          <div className="text-xs font-medium">Di</div>
          <div className="text-xs font-medium">Mi</div>
          <div className="text-xs font-medium">Do</div>
          <div className="text-xs font-medium">Fr</div>
          <div className="text-xs font-medium">Sa</div>
          <div className="text-xs font-medium">So</div>
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1 mt-1">
            {week.map((day, dayIndex) => {
              const dayEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                return isSameDay(eventDate, day);
              });

              return (
                <div 
                  key={dayIndex} 
                  className={cn(
                    "min-h-[80px] p-1 border rounded",
                    !isSameMonth(day, date) && "bg-muted/20 text-muted-foreground",
                    isToday(day) && "border-primary"
                  )}
                  onClick={() => {
                    setDate(day);
                    handleNewEvent(day);
                  }}
                >
                  <div className="text-right mb-1">
                    <span className={cn(
                      "inline-flex h-6 w-6 items-center justify-center text-xs rounded-full",
                      isToday(day) && "bg-primary text-primary-foreground",
                    )}>
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event, eventIndex) => (
                      <div 
                        key={eventIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewEvent(event);
                        }}
                        className={`text-xs truncate p-1 rounded cursor-pointer ${getEventTypeColor(event.type)}`}
                      >
                        <div className="flex items-center gap-1">
                          {getEventTypeIcon(event.type)}
                          <span className="truncate">{event.startTime} {event.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayEvents.length - 3} weitere
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
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
          <Button className="flex items-center gap-2" onClick={() => handleNewEvent()}>
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
                onSelect={(newDate) => newDate && setDate(newDate)}
                modifiers={{ booked: getEventDays() }}
                modifiersStyles={{ booked: { fontWeight: 'bold', backgroundColor: 'rgba(34, 197, 94, 0.1)' } }}
                className="p-3 pointer-events-auto"
                locale={de}
              />
            </PopoverContent>
          </Popover>

          <div className="mt-4">
            <h3 className="text-lg font-medium mb-2">Kalenderansicht</h3>
            <Tabs defaultValue={view} value={view} onValueChange={(v) => setView(v as CalendarView)}>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={navigatePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={navigateToday}>
                Heute
              </Button>
              <Button size="sm" variant="outline" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h3 className="text-lg font-medium">
              {view === 'day' ? format(date, "d. MMMM yyyy", { locale: de }) :
               view === 'week' ? `${format(weekDays[0], "d. MMM", { locale: de })} - ${format(weekDays[6], "d. MMM yyyy", { locale: de })}` :
               format(date, "MMMM yyyy", { locale: de })}
            </h3>
          </div>
          
          {view === 'day' && (
            <div className="space-y-1">
              {filteredEvents.length > 0 ? (
                <div className="space-y-4">
                  {renderDayViewTimeSlots()}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Keine Termine für diesen Tag</p>
                  <Button variant="outline" className="mt-4" onClick={() => handleNewEvent()}>
                    Termin hinzufügen
                  </Button>
                </div>
              )}
            </div>
          )}

          {view === 'week' && renderWeekView()}
          
          {view === 'month' && renderMonthView()}
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
                      onSelect={(newDate) => newDate && setNewEventData({...newEventData, date: newDate})}
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

      {/* View Event Dialog with Patient Briefing */}
      <Dialog open={isViewEventOpen} onOpenChange={setIsViewEventOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {currentEvent && (
              <>
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
                      currentEvent.type === 'videoconsultation' && "bg-green-500",
                      currentEvent.type === 'appointment' && "bg-blue-500",
                      currentEvent.type === 'prescription' && "bg-yellow-500",
                      currentEvent.type === 'patient' && "bg-purple-500"
                    )}>
                      {getEventTypeIcon(currentEvent.type)}
                      <span className="ml-1">
                        {currentEvent.type === 'videoconsultation' && "Videosprechstunde"}
                        {currentEvent.type === 'appointment' && "Regulärer Termin"}
                        {currentEvent.type === 'prescription' && "Rezeptverwaltung"}
                        {currentEvent.type === 'patient' && "Patiententermin"}
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
                        onClick={togglePatientBriefing}
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
              </>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button 
              variant="destructive" 
              onClick={() => currentEvent && handleDeleteEvent(currentEvent.id)}
            >
              Termin löschen
            </Button>
            <Button variant="outline" onClick={() => setIsViewEventOpen(false)}>
              Schließen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Calendar Sync Dialog */}
      <Dialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Kalender synchronisieren</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm">Wählen Sie einen Kalenderdienst zur Synchronisation aus:</p>
            <div className="space-y-2">
              {calendarSyncOptions.map((option) => (
                <div 
                  key={option.id}
                  className="flex items-center justify-between p-3 border rounded hover:bg-slate-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {option.id === 'google' && <div className="w-5 h-5 bg-red-500 rounded-full" />}
                    {option.id === 'outlook' && <div className="w-5 h-5 bg-blue-500 rounded-full" />}
                    {option.id === 'apple' && <div className="w-5 h-5 bg-gray-800 rounded-full" />}
                    {option.id === 'caldav' && <div className="w-5 h-5 bg-purple-500 rounded-full" />}
                    <span>{option.name}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            
            <Alert>
              <AlertDescription className="text-xs">
                Bei der Synchronisation werden keine sensiblen Patientendaten übertragen. 
                Patientennamen werden pseudonymisiert und Notizen werden nicht synchronisiert.
              </AlertDescription>
            </Alert>
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
