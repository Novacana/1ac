
import React from 'react';
import { Card } from "@/components/ui/card";
import { CalendarEvent } from './types';
import CalendarSidebar from './CalendarSidebar';
import CalendarHeader from './CalendarHeader';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';

interface CalendarDesktopLayoutProps {
  view: string;
  date: Date;
  setDate: (date: Date) => void;
  setView: (view: any) => void;
  eventDays: Date[];
  dateHeader: string;
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
  handleNewEvent: (date?: Date) => void;
  weekDays: Date[];
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  handleViewEvent: (event: CalendarEvent) => void;
  onSyncClick: () => void;
}

const CalendarDesktopLayout: React.FC<CalendarDesktopLayoutProps> = ({
  view,
  date,
  setDate,
  setView,
  eventDays,
  dateHeader,
  navigatePrevious,
  navigateNext,
  navigateToday,
  handleNewEvent,
  weekDays,
  events,
  filteredEvents,
  handleViewEvent,
  onSyncClick
}) => {
  return (
    <div className="space-y-6">
      <CalendarHeader 
        onPrevious={navigatePrevious}
        onNext={navigateNext}
        onToday={navigateToday}
        onNewEvent={() => handleNewEvent()}
        onSyncClick={onSyncClick}
        dateHeader={dateHeader}
        showNavigation={false}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalendarSidebar 
          date={date}
          view={view}
          onDateChange={setDate}
          onViewChange={setView}
          eventDays={eventDays}
        />

        <Card className="p-4 lg:col-span-2">
          <CalendarHeader 
            onPrevious={navigatePrevious}
            onNext={navigateNext}
            onToday={navigateToday}
            onNewEvent={() => handleNewEvent()}
            onSyncClick={onSyncClick}
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
    </div>
  );
};

export default CalendarDesktopLayout;
