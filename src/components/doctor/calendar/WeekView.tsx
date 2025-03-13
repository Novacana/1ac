
import React from 'react';
import { format, isSameDay, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarEvent } from './types';
import { getEventTypeIcon, getEventTypeColor } from './utils';

interface WeekViewProps {
  weekDays: Date[];
  date: Date;
  events: CalendarEvent[];
  onNewEvent: (selectedDate?: Date) => void;
  onViewEvent: (event: CalendarEvent) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ weekDays, date, events, onNewEvent, onViewEvent }) => {
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
                        onNewEvent(newDate);
                      }
                    }}
                  >
                    {dayEvents.length > 0 ? (
                      dayEvents.map(event => (
                        <div 
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onViewEvent(event);
                          }}
                          className={`text-xs p-1 rounded truncate cursor-pointer ${getEventTypeColor(event.type)} hover:opacity-90 transition-opacity`}
                        >
                          <div className="flex items-center gap-1">
                            {React.createElement(getEventTypeIcon(event.type), { className: "h-4 w-4" })}
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

export default WeekView;
