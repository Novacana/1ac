
import React from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

// Import components
import CalendarMobileLayout from './calendar/CalendarMobileLayout';
import CalendarDesktopLayout from './calendar/CalendarDesktopLayout';
import NewEventDialog from './calendar/NewEventDialog';
import ViewEventDialog from './calendar/ViewEventDialog';
import SyncCalendarDialog from './calendar/SyncCalendarDialog';

// Import hook and utils
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { calendarSyncOptions } from './calendar/mockData';

const DoctorCalendar: React.FC = () => {
  const isMobile = useIsMobile();
  const {
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
  } = useCalendarEvents();

  return (
    <>
      {isMobile ? (
        <CalendarMobileLayout
          view={view}
          setView={setView}
          dateHeader={dateHeader}
          navigatePrevious={navigatePrevious}
          navigateNext={navigateNext}
          navigateToday={navigateToday}
          handleNewEvent={handleNewEvent}
          date={date}
          weekDays={weekDays}
          filteredEvents={filteredEvents}
          events={events}
          handleViewEvent={handleViewEvent}
          onSyncClick={() => setIsSyncDialogOpen(true)}
        />
      ) : (
        <CalendarDesktopLayout
          view={view}
          date={date}
          setDate={setDate}
          setView={setView}
          eventDays={eventDays}
          dateHeader={dateHeader}
          navigatePrevious={navigatePrevious}
          navigateNext={navigateNext}
          navigateToday={navigateToday}
          handleNewEvent={handleNewEvent}
          weekDays={weekDays}
          events={events}
          filteredEvents={filteredEvents}
          handleViewEvent={handleViewEvent}
          onSyncClick={() => setIsSyncDialogOpen(true)}
        />
      )}

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
    </>
  );
};

export default DoctorCalendar;
