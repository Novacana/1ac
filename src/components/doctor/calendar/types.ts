
import { ReactNode } from 'react';

export type EventType = 'videoconsultation' | 'appointment' | 'prescription' | 'patient';
export type CalendarView = 'day' | 'week' | 'month';

export type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: EventType;
  notes?: string;
  patientName?: string;
};

export type PatientRecordType = 'diagnosis' | 'prescription' | 'notes' | 'lab' | 'imaging';
export type PatientRecord = {
  id: string;
  type: PatientRecordType;
  title: string;
  date: Date;
  content: string;
};

export type CalendarSyncOption = {
  id: string;
  name: string;
};
