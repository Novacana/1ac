
// Mock consultation data
export const mockConsultations = [
  {
    id: 'CONS-2458',
    date: '20. Juli 2023',
    doctor: 'Dr. Schmidt',
    status: 'completed',
    type: 'Erstberatung',
    notes: 'Erstrezept für CBD Öl 5% ausgestellt.',
    doctorSpecialty: 'Allgemeinmedizin',
    duration: '25 Minuten',
    summary: 'Ausführliche Erstberatung zu cannabisbasierten Therapiemöglichkeiten. Patient berichtet über chronische Schmerzen. Empfehlung für CBD Öl 5% mit anfänglich niedriger Dosierung.'
  },
  {
    id: 'CONS-1785',
    date: '5. August 2023',
    doctor: 'Dr. Schmidt',
    status: 'scheduled',
    type: 'Nachsorge',
    appointmentDate: '12. August 2023, 14:30 Uhr',
    doctorSpecialty: 'Allgemeinmedizin',
    duration: '15 Minuten',
    summary: 'Folgetermin zur Überprüfung des Therapieverlaufs und ggf. Anpassung der Dosierung.'
  },
  {
    id: 'CONS-3025',
    date: '15. Juni 2023',
    doctor: 'Dr. Schmidt',
    status: 'pending',
    type: 'Rezepterneuerung',
    notes: 'Anfrage für Rezepterneuerung gestellt.',
    doctorSpecialty: 'Allgemeinmedizin',
    duration: 'N/A',
    summary: 'Anfrage zur Erneuerung des bestehenden Rezepts für CBD Öl 5%. Patient berichtet über gute Verträglichkeit und Wirksamkeit.'
  }
];
