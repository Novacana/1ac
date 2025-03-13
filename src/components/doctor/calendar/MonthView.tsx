
import React from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarEvent } from './types';
import { getEventTypeIcon, getEventTypeColor } from './utils';

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (day: Date) => void;
  onViewEvent: (event: CalendarEvent) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ date, events, onDateSelect, onViewEvent }) => {
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
                onClick={() => onDateSelect(day)}
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
                        onViewEvent(event);
                      }}
                      className={`text-xs truncate p-1 rounded cursor-pointer ${getEventTypeColor(event.type)}`}
                    >
                      <div className="flex items-center gap-1">
                        {React.createElement(getEventTypeIcon(event.type), { className: "h-4 w-4" })}
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

export default MonthView;
