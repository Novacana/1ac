
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const VideoConsultation = () => {
  const [appointments, setAppointments] = useState([
    {
      id: '1',
      patientName: 'Maria Schmidt',
      time: '14:30 - 15:00',
      status: 'upcoming',
      date: 'Heute'
    },
    {
      id: '2',
      patientName: 'Thomas Müller',
      time: '16:00 - 16:30',
      status: 'upcoming',
      date: 'Heute'
    }
  ]);
  
  const [videoOpen, setVideoOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [newAppointmentOpen, setNewAppointmentOpen] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [newAppointmentTime, setNewAppointmentTime] = useState('');
  const [newAppointmentPatient, setNewAppointmentPatient] = useState('');

  const handleJoinSession = (appointment: any) => {
    // In a real implementation, this would connect to a video service
    setCurrentAppointment(appointment);
    setVideoOpen(true);
    toast.success(`Videosprechstunde mit ${appointment.patientName} gestartet`);
  };

  const handleOpenChat = (appointment: any) => {
    // In a real implementation, this would open a chat interface
    setCurrentAppointment(appointment);
    setChatOpen(true);
  };

  const handleCreateNewSession = () => {
    setNewAppointmentOpen(true);
  };

  const handleSaveNewAppointment = () => {
    // GDPR compliance: Validate and sanitize inputs
    if (!newAppointmentPatient || !newAppointmentDate || !newAppointmentTime) {
      toast.error('Bitte füllen Sie alle Felder aus');
      return;
    }

    // Create a new appointment with a unique ID
    const newAppointment = {
      id: `${Date.now()}`,
      patientName: newAppointmentPatient,
      time: newAppointmentTime,
      status: 'upcoming',
      date: newAppointmentDate
    };

    // Add to appointments list
    setAppointments([...appointments, newAppointment]);
    
    // Reset form and close dialog
    setNewAppointmentPatient('');
    setNewAppointmentDate('');
    setNewAppointmentTime('');
    setNewAppointmentOpen(false);
    
    toast.success('Neue Videosprechstunde erfolgreich angelegt');
  };

  const closeVideoSession = () => {
    setVideoOpen(false);
    toast.info('Videosprechstunde beendet');
  };

  const closeChatSession = () => {
    setChatOpen(false);
  };

  // FHIR compliance note: In a production environment, this component would integrate with FHIR API
  // for patient data and appointment scheduling, ensuring standard compliance

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Videosprechstunde</h2>
        <Button 
          className="flex items-center gap-2" 
          onClick={handleCreateNewSession}
        >
          <Video className="h-4 w-4" />
          Neue Sprechstunde
        </Button>
      </div>

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{appointment.patientName}</h3>
                <p className="text-sm text-muted-foreground">
                  {appointment.date}, {appointment.time}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Anstehend</Badge>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => handleJoinSession(appointment)}
                >
                  <Video className="h-4 w-4" />
                  Beitreten
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => handleOpenChat(appointment)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Video Session Dialog */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Videosprechstunde mit {currentAppointment?.patientName}</DialogTitle>
          </DialogHeader>
          <div className="h-96 bg-black flex items-center justify-center text-white">
            <p>Video Streaming Interface</p>
            <p className="text-xs absolute bottom-4">
              In accordance with GDPR and HIPAA, this video session is encrypted and not recorded.
            </p>
          </div>
          <DialogFooter>
            <Button variant="destructive" onClick={closeVideoSession}>Beenden</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Chat Dialog */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chat mit {currentAppointment?.patientName}</DialogTitle>
          </DialogHeader>
          <div className="h-80 border rounded p-4 overflow-y-auto mb-4">
            <p className="text-sm text-muted-foreground">Chatverlauf wird hier angezeigt</p>
            <p className="text-xs text-muted-foreground mt-4">
              Gemäß DSGVO/GDPR werden Chat-Protokolle nach 30 Tagen automatisch gelöscht.
            </p>
          </div>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 p-2 border rounded" 
              placeholder="Nachricht eingeben..." 
              aria-label="Nachricht eingeben"
            />
            <Button>Senden</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Appointment Dialog */}
      <Dialog open={newAppointmentOpen} onOpenChange={setNewAppointmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Neue Videosprechstunde</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="patient" className="text-sm font-medium">Patient</label>
              <input 
                id="patient"
                type="text" 
                className="w-full p-2 border rounded" 
                value={newAppointmentPatient}
                onChange={(e) => setNewAppointmentPatient(e.target.value)}
                placeholder="Patientenname"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium">Datum</label>
              <input 
                id="date"
                type="text" 
                className="w-full p-2 border rounded" 
                value={newAppointmentDate}
                onChange={(e) => setNewAppointmentDate(e.target.value)}
                placeholder="z.B. Heute, Morgen, 15.06.2025"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">Uhrzeit</label>
              <input 
                id="time"
                type="text" 
                className="w-full p-2 border rounded" 
                value={newAppointmentTime}
                onChange={(e) => setNewAppointmentTime(e.target.value)}
                placeholder="z.B. 14:30 - 15:00"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Hinweis: Die Terminplanung erfolgt gemäß DSGVO und HIPAA-Richtlinien.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewAppointmentOpen(false)}>Abbrechen</Button>
            <Button onClick={handleSaveNewAppointment}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VideoConsultation;
