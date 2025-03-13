
import React from 'react';
import { Button } from "@/components/ui/button";
import { Day, Month, CalendarDays } from "lucide-react";
import { CalendarEvent, CalendarView } from './types';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';
import CalendarHeader from './CalendarHeader';

interface CalendarMobileLayoutProps {
  view: CalendarView;
  setView: (view: CalendarView) => void;
  dateHeader: string;
  navigatePrevious: () => void;
  navigateNext: () => void;
  navigateToday: () => void;
  handleNewEvent: (date?: Date) => void;
  date: Date;
  weekDays: Date[];
  filteredEvents: CalendarEvent[];
  events: CalendarEvent[];
  handleViewEvent: (event: CalendarEvent) => void;
  onSyncClick: () => void;
}

const CalendarMobileLayout: React.FC<CalendarMobileLayoutProps> = ({
  view,
  setView,
  dateHeader,
  navigatePrevious,
  navigateNext,
  navigateToday,
  handleNewEvent,
  date,
  weekDays,
  filteredEvents,
  events,
  handleViewEvent,
  onSyncClick
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <CalendarHeader 
          onPrevious={navigatePrevious}
          onNext={navigateNext}
          onToday={navigateToday}
          onNewEvent={() => handleNewEvent()}
          onSyncClick={onSyncClick}
          dateHeader={dateHeader}
          showMainTitle={false}
        />
      </div>
      
      <div className="mb-2">
        <div className="flex justify-center mb-3">
          <div className="inline-flex rounded-md shadow-sm">
            <Button 
              variant={view === 'day' ? 'default' : 'outline'} 
              className="rounded-l-md rounded-r-none px-3 py-1 h-9"
              onClick={() => setView('day')}
            >
              <Day className="h-4 w-4 mr-1" />
              Tag
            </Button>
            <Button 
              variant={view === 'week' ? 'default' : 'outline'} 
              className="rounded-none px-3 py-1 h-9 border-x-0"
              onClick={() => setView('week')}
            >
              <CalendarDays className="h-4 w-4 mr-1" />
              Woche
            </Button>
            <Button 
              variant={view === 'month' ? 'default' : 'outline'} 
              className="rounded-r-md rounded-l-none px-3 py-1 h-9"
              onClick={() => setView('month')}
            >
              <Month className="h-4 w-4 mr-1" />
              Monat
            </Button>
          </div>
        </div>
      </div>
      
      {view === 'day' && (
        <DayView 
          filteredEvents={filteredEvents}
          date={date}
          onNewEvent={handleNewEvent}
          onViewEvent={handleViewEvent}
        />
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
            setView('day');
            handleNewEvent(day);
          }}
          onViewEvent={handleViewEvent}
        />
      )}
    </div>
  );
};

export default CalendarMobileLayout;
