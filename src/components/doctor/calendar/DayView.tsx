
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { CalendarEvent } from './types';
import { getEventTypeIcon, getEventTypeColor } from './utils';

interface DayViewProps {
  filteredEvents: CalendarEvent[];
  date: Date;
  onNewEvent: (selectedDate?: Date) => void;
  onViewEvent: (event: CalendarEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({ filteredEvents, date, onNewEvent, onViewEvent }) => {
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
                  onClick={() => onViewEvent(event)}
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
                  onNewEvent(newDate);
                }}
              />
            )}
          </div>
        </div>
      );
    }
    return timeSlots;
  };

  if (filteredEvents.length > 0) {
    return <div className="space-y-4">{renderDayViewTimeSlots()}</div>;
  }

  return (
    <div className="text-center p-8 text-muted-foreground">
      <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
      <p>Keine Termine für diesen Tag</p>
      <Button variant="outline" className="mt-4" onClick={() => onNewEvent()}>
        Termin hinzufügen
      </Button>
    </div>
  );
};

export default DayView;
