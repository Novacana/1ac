
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const VideoConsultation = () => {
  const appointments = [
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
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Videosprechstunde</h2>
        <Button className="flex items-center gap-2">
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
                <Button className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Beitreten
                </Button>
                <Button variant="outline" size="icon">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoConsultation;
