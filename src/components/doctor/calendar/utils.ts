
import { EventType, PatientRecordType, CalendarEvent } from './types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, isSameMonth } from 'date-fns';
import { de } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { LucideIcon, ClipboardList, FileText, ScrollText, FileDigit, FileClock, Video, Clock, Users, Calendar } from 'lucide-react';
import { ReactNode } from 'react';

// Helper function to convert time string to hours/minutes
export const timeStringToDate = (timeStr: string, baseDate: Date): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const date = new Date(baseDate);
  date.setHours(hours);
  date.setMinutes(minutes);
  return date;
};

export const getEventTypeIcon = (type: EventType): LucideIcon => {
  switch (type) {
    case 'videoconsultation':
      return Video;
    case 'appointment':
      return Clock;
    case 'prescription':
      return FileText;
    case 'patient':
      return Users;
    default:
      return Calendar;
  }
};

export const getEventTypeColor = (type: EventType): string => {
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

export const getRecordTypeIcon = (type: PatientRecordType): LucideIcon => {
  switch (type) {
    case 'diagnosis':
      return ClipboardList;
    case 'prescription':
      return FileText;
    case 'notes':
      return ScrollText;
    case 'lab':
      return FileDigit;
    case 'imaging':
      return FileClock;
    default:
      return FileText;
  }
};

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Start on Monday
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const getMonthDays = (date: Date) => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

export const getEventDays = (events: CalendarEvent[]) => {
  return events.map(event => new Date(
    event.date.getFullYear(),
    event.date.getMonth(),
    event.date.getDate()
  ));
};

export const filterEventsByView = (events: CalendarEvent[], date: Date, view: string, weekDays: Date[]) => {
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
};

export const getDateHeader = (view: string, date: Date, weekDays: Date[]) => {
  if (view === 'day') {
    return format(date, "d. MMMM yyyy", { locale: de });
  } else if (view === 'week') {
    return `${format(weekDays[0], "d. MMM", { locale: de })} - ${format(weekDays[6], "d. MMM yyyy", { locale: de })}`;
  } else {
    return format(date, "MMMM yyyy", { locale: de });
  }
};
