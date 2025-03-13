
import { CalendarEvent, PatientRecord, CalendarSyncOption } from './types';

// Mock initial events for testing
export const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Videosprechstunde mit Maria Schmidt',
    date: new Date(),
    startTime: '14:30',
    endTime: '15:00',
    type: 'videoconsultation',
    patientName: 'Maria Schmidt'
  },
  {
    id: '2',
    title: 'Videosprechstunde mit Thomas Müller',
    date: new Date(),
    startTime: '16:00',
    endTime: '16:30',
    type: 'videoconsultation',
    patientName: 'Thomas Müller'
  },
  {
    id: '3',
    title: 'Rezepterneuerung prüfen',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    startTime: '10:00',
    endTime: '10:30',
    type: 'prescription'
  },
  {
    id: '4',
    title: 'Patiententermin mit Sophia Weber',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    startTime: '09:00',
    endTime: '09:30',
    type: 'patient',
    patientName: 'Sophia Weber'
  },
  {
    id: '5',
    title: 'Regulärer Termin',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    startTime: '11:30',
    endTime: '12:00',
    type: 'appointment'
  },
  {
    id: '6',
    title: 'Videosprechstunde mit Hans Becker',
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    startTime: '15:30',
    endTime: '16:00',
    type: 'videoconsultation',
    patientName: 'Hans Becker'
  }
];

// Mock patient records
export const getMockPatientRecords = (patientName: string): PatientRecord[] => {
  if (!patientName) return [];
  
  return [
    {
      id: '1',
      type: 'diagnosis',
      title: 'Erstdiagnose',
      date: new Date(2025, 2, 1), // March 1, 2025
      content: 'Chronische Migräne mit Aura. Patient berichtet über regelmäßige Anfälle 2-3 mal pro Monat.'
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Rezept Sumatriptan',
      date: new Date(2025, 2, 5), // March 5, 2025
      content: 'Sumatriptan 50mg, bei Bedarf, maximal 2 Tabletten in 24 Stunden.'
    },
    {
      id: '3',
      type: 'notes',
      title: 'Verlaufsgespräch',
      date: new Date(2025, 2, 10), // March 10, 2025
      content: 'Patient berichtet über leichte Verbesserung unter Sumatriptan, aber weiterhin Probleme mit Schlafqualität.'
    },
    {
      id: '4',
      type: 'lab',
      title: 'Blutbild',
      date: new Date(2025, 2, 12), // March 12, 2025
      content: 'Blutwerte im Normbereich. Vitamin D-Wert leicht erniedrigt (28 ng/ml).'
    },
    {
      id: '5',
      type: 'imaging',
      title: 'MRT Kopf',
      date: new Date(2025, 2, 15), // March 15, 2025
      content: 'Keine strukturellen Auffälligkeiten festgestellt, die auf sekundäre Kopfschmerzursachen hindeuten.'
    }
  ];
};

export const calendarSyncOptions: CalendarSyncOption[] = [
  { id: 'google', name: 'Google Calendar' },
  { id: 'outlook', name: 'Microsoft Outlook' },
  { id: 'apple', name: 'Apple iCalendar' },
  { id: 'caldav', name: 'CalDAV' }
];
