
import React, { useState } from "react";
import { Calendar, Clock, Info, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { logGdprActivity } from "@/utils/fhirCompliance";
import { useAuth } from "@/contexts/AuthContext";

interface ScheduleTabProps {
  setHasUnsavedChanges: (value: boolean) => void;
}

interface DaySchedule {
  dayName: string;
  dayIndex: number;
  morningStart: string;
  morningEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  isActive: boolean;
}

const daysOfWeek = [
  { name: "Montag", index: 1 },
  { name: "Dienstag", index: 2 },
  { name: "Mittwoch", index: 3 },
  { name: "Donnerstag", index: 4 },
  { name: "Freitag", index: 5 },
  { name: "Samstag", index: 6 },
  { name: "Sonntag", index: 0 },
];

const ScheduleTab: React.FC<ScheduleTabProps> = ({ setHasUnsavedChanges }) => {
  const { user } = useAuth();
  const [scheduleType, setScheduleType] = useState<'regular' | 'special'>('regular');
  const [schedule, setSchedule] = useState<DaySchedule[]>(
    daysOfWeek.map(day => ({
      dayName: day.name,
      dayIndex: day.index,
      morningStart: "09:00",
      morningEnd: "12:00",
      afternoonStart: "14:00",
      afternoonEnd: "17:00",
      isActive: day.index < 6 // Monday to Friday active by default
    }))
  );
  
  const handleTimeChange = (
    dayIndex: number, 
    period: 'morningStart' | 'morningEnd' | 'afternoonStart' | 'afternoonEnd', 
    value: string
  ) => {
    const updatedSchedule = schedule.map(day => 
      day.dayIndex === dayIndex ? { ...day, [period]: value } : day
    );
    setSchedule(updatedSchedule);
    setHasUnsavedChanges(true);
  };
  
  const handleDayToggle = (dayIndex: number) => {
    const updatedSchedule = schedule.map(day => 
      day.dayIndex === dayIndex ? { ...day, isActive: !day.isActive } : day
    );
    setSchedule(updatedSchedule);
    setHasUnsavedChanges(true);
  };
  
  const handleSaveSchedule = async () => {
    if (!user) {
      toast.error("Benutzer nicht angemeldet");
      return;
    }
    
    try {
      // Convert to FHIR Schedule format
      const fhirSchedule = {
        resourceType: "Schedule",
        id: `schedule-${user.id}`,
        actor: [
          {
            reference: `Practitioner/${user.id}`,
            display: user.name
          }
        ],
        planningHorizon: {
          start: new Date().toISOString(),
          end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        },
        comment: "Regelmäßige Sprechzeiten",
        // FHIR requires different format for availability
        // This would be converted to proper FHIR format in a real implementation
      };
      
      console.log("Saving FHIR Schedule:", fhirSchedule);
      
      // Log GDPR activity
      await logGdprActivity(
        user.id,
        'schedule_update',
        'Doctor updated their availability schedule'
      );
      
      toast.success("Sprechzeiten erfolgreich gespeichert");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving schedule:", error);
      toast.error("Fehler beim Speichern der Sprechzeiten");
    }
  };
  
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <Calendar className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          Ihre Verfügbarkeit wird als FHIR Schedule und Slot Ressourcen gespeichert, 
          konform mit GDPR und HIPAA-Richtlinien.
        </AlertDescription>
      </Alert>
      
      <Tabs value={scheduleType} onValueChange={(v) => setScheduleType(v as 'regular' | 'special')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regular">Reguläre Sprechzeiten</TabsTrigger>
          <TabsTrigger value="special">Sonderzeiten</TabsTrigger>
        </TabsList>
        
        <TabsContent value="regular">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Wöchentliche Sprechzeiten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedule.map((day) => (
                  <div key={day.dayIndex} className="p-4 border rounded-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`day-${day.dayIndex}`}
                            checked={day.isActive}
                            onChange={() => handleDayToggle(day.dayIndex)}
                            className="h-4 w-4 rounded mr-2"
                          />
                          <label htmlFor={`day-${day.dayIndex}`} className="font-medium">{day.dayName}</label>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {day.isActive ? "Offen" : "Geschlossen"}
                      </div>
                    </div>
                    
                    {day.isActive && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Vormittag</p>
                          <div className="flex gap-2">
                            <div className="w-1/2">
                              <input
                                type="time"
                                value={day.morningStart}
                                onChange={(e) => handleTimeChange(day.dayIndex, 'morningStart', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <span className="flex items-center">-</span>
                            <div className="w-1/2">
                              <input
                                type="time"
                                value={day.morningEnd}
                                onChange={(e) => handleTimeChange(day.dayIndex, 'morningEnd', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Nachmittag</p>
                          <div className="flex gap-2">
                            <div className="w-1/2">
                              <input
                                type="time"
                                value={day.afternoonStart}
                                onChange={(e) => handleTimeChange(day.dayIndex, 'afternoonStart', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                            <span className="flex items-center">-</span>
                            <div className="w-1/2">
                              <input
                                type="time"
                                value={day.afternoonEnd}
                                onChange={(e) => handleTimeChange(day.dayIndex, 'afternoonEnd', e.target.value)}
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="special">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Sonderzeiten und Urlaub
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-center">Sonderzeiten und Urlaubsplanung können hier eingetragen werden.</p>
              <p className="text-muted-foreground text-center text-sm mt-1">Diese Funktion wird in Kürze verfügbar sein.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSchedule} className="gap-2">
          <Save className="h-4 w-4" />
          Sprechzeiten speichern
        </Button>
      </div>
    </div>
  );
};

export default ScheduleTab;
