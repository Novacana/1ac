
import React, { useState, useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from "date-fns";

// Import components
import CalendarSidebar from './calendar/CalendarSidebar';
import CalendarHeader from './calendar/CalendarHeader';
import DayView from './calendar/DayView';
import WeekView from './calendar/WeekView';
import MonthView from './calendar/MonthView';
import NewEventDialog from './calendar/NewEventDialog';
import ViewEventDialog from './calendar/ViewEventDialog';
import SyncCalendarDialog from './calendar/SyncCalendarDialog';

// Import types and utils
import { CalendarEvent, CalendarView } from './calendar/types';
import { initialEvents, getMockPatientRecords, calendarSyncOptions } from './calendar/mockData';
import { getWeekDays, getEventDays, filterEventsByView, getDateHeader } from './calendar/utils';

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
    type: 'appointment' as const,
    notes: '',
    patientName: ''
  });

  // Get patient records for current event
  const patientRecords = useMemo(() => {
    return currentEvent?.patientName ? getMockPatientRecords(currentEvent.patientName) : [];
  }, [currentEvent?.patientName]);

  // Generate days for week view
  const weekDays = useMemo(() => getWeekDays(date), [date]);

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
  const filteredEvents = useMemo(() => 
    filterEventsByView(events, date, view, weekDays), 
    [events, date, view, weekDays]
  );

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

  const dateHeader = getDateHeader(view, date, weekDays);

  return (
    <div className="space-y-6">
      <CalendarHeader 
        onPrevious={navigatePrevious}
        onNext={navigateNext}
        onToday={navigateToday}
        onNewEvent={() => handleNewEvent()}
        onSyncClick={() => setIsSyncDialogOpen(true)}
        dateHeader={dateHeader}
        showNavigation={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalendarSidebar 
          date={date}
          view={view}
          onDateChange={setDate}
          onViewChange={setView}
          eventDays={getEventDays(events)}
        />

        <Card className="p-4 lg:col-span-2">
          <CalendarHeader 
            onPrevious={navigatePrevious}
            onNext={navigateNext}
            onToday={navigateToday}
            onNewEvent={() => handleNewEvent()}
            onSyncClick={() => setIsSyncDialogOpen(true)}
            dateHeader={dateHeader}
            showMainTitle={false}
          />
          
          {view === 'day' && (
            <div className="space-y-1">
              <DayView 
                filteredEvents={filteredEvents}
                date={date}
                onNewEvent={handleNewEvent}
                onViewEvent={handleViewEvent}
              />
            </div>
          )}

          {view === 'week' && (
            <WeekView 
              weekDays={weekDays}
              date={date}
              events={events}
              onNewEvent={handleNewEvent}
              onViewEvent={handleViewEvent}
            />
          )}
          
          {view === 'month' && (
            <MonthView 
              date={date}
              events={events}
              onDateSelect={(day) => {
                setDate(day);
                handleNewEvent(day);
              }}
              onViewEvent={handleViewEvent}
            />
          )}
        </Card>
      </div>

      {/* Dialogs */}
      <NewEventDialog 
        isOpen={isNewEventOpen}
        onOpenChange={setIsNewEventOpen}
        newEventData={newEventData}
        onDataChange={setNewEventData}
        onCreateEvent={handleCreateEvent}
      />

      <ViewEventDialog 
        isOpen={isViewEventOpen}
        onOpenChange={setIsViewEventOpen}
        currentEvent={currentEvent}
        patientRecords={patientRecords}
        showPatientBriefing={showPatientBriefing}
        onTogglePatientBriefing={togglePatientBriefing}
        onDeleteEvent={handleDeleteEvent}
      />

      <SyncCalendarDialog 
        isOpen={isSyncDialogOpen}
        onOpenChange={setIsSyncDialogOpen}
        onSyncCalendars={handleSyncCalendars}
        syncOptions={calendarSyncOptions}
      />
    </div>
  );
};

export default DoctorCalendar;
