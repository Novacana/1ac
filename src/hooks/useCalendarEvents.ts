
import { useState, useMemo } from 'react';
import { addDays, subDays, addWeeks, subWeeks, addMonths, subMonths } from "date-fns";
import { toast } from "sonner";
import { CalendarEvent, CalendarView } from '@/components/doctor/calendar/types';
import { getWeekDays, filterEventsByView, getDateHeader, getEventDays } from '@/components/doctor/calendar/utils';
import { getMockPatientRecords, initialEvents } from '@/components/doctor/calendar/mockData';

export const useCalendarEvents = () => {
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

  // Generate days for week view
  const weekDays = useMemo(() => getWeekDays(date), [date]);

  // Get patient records for current event
  const patientRecords = useMemo(() => {
    return currentEvent?.patientName ? getMockPatientRecords(currentEvent.patientName) : [];
  }, [currentEvent?.patientName]);

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
  const eventDays = getEventDays(events);

  return {
    date,
    setDate,
    events,
    view,
    setView,
    isNewEventOpen,
    setIsNewEventOpen,
    isViewEventOpen, 
    setIsViewEventOpen,
    isSyncDialogOpen,
    setIsSyncDialogOpen,
    currentEvent,
    showPatientBriefing,
    newEventData,
    setNewEventData,
    weekDays,
    patientRecords,
    filteredEvents,
    navigatePrevious,
    navigateNext,
    navigateToday,
    handleNewEvent,
    handleCreateEvent,
    handleViewEvent,
    togglePatientBriefing,
    handleDeleteEvent,
    handleSyncCalendars,
    dateHeader,
    eventDays
  };
};
