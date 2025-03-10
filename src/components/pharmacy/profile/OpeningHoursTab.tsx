
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

interface TimeSlot {
  id: string;
  day: string;
  from: string;
  to: string;
}

interface OpeningHoursTabProps {
  onChange: () => void;
}

const DAYS = [
  { value: "monday", label: "Montag" },
  { value: "tuesday", label: "Dienstag" },
  { value: "wednesday", label: "Mittwoch" },
  { value: "thursday", label: "Donnerstag" },
  { value: "friday", label: "Freitag" },
  { value: "saturday", label: "Samstag" },
  { value: "sunday", label: "Sonntag" },
];

const OpeningHoursTab: React.FC<OpeningHoursTabProps> = ({ onChange }) => {
  const [isOpen24h, setIsOpen24h] = useState(false);
  const [hasEmergencyHours, setHasEmergencyHours] = useState(false);
  const [regularHours, setRegularHours] = useState<TimeSlot[]>([
    { id: '1', day: 'monday', from: '09:00', to: '18:00' },
    { id: '2', day: 'tuesday', from: '09:00', to: '18:00' },
    { id: '3', day: 'wednesday', from: '09:00', to: '18:00' },
    { id: '4', day: 'thursday', from: '09:00', to: '18:00' },
    { id: '5', day: 'friday', from: '09:00', to: '18:00' },
    { id: '6', day: 'saturday', from: '09:00', to: '13:00' },
  ]);
  
  const addTimeSlot = () => {
    const newSlot = {
      id: Date.now().toString(),
      day: "monday",
      from: "09:00",
      to: "18:00"
    };
    setRegularHours([...regularHours, newSlot]);
    onChange();
  };
  
  const updateTimeSlot = (id: string, field: keyof TimeSlot, value: string) => {
    const updatedHours = regularHours.map((slot) => 
      slot.id === id ? { ...slot, [field]: value } : slot
    );
    setRegularHours(updatedHours);
    onChange();
  };
  
  const removeTimeSlot = (id: string) => {
    const updatedHours = regularHours.filter((slot) => slot.id !== id);
    setRegularHours(updatedHours);
    onChange();
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Reguläre Öffnungszeiten</h3>
            <p className="text-sm text-muted-foreground">
              Die regulären Öffnungszeiten Ihrer Apotheke
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="open24h" 
              checked={isOpen24h}
              onCheckedChange={(checked) => {
                setIsOpen24h(checked);
                onChange();
              }}
            />
            <Label htmlFor="open24h" className="cursor-pointer">
              24/7 geöffnet
            </Label>
          </div>
        </div>
        
        {!isOpen24h && (
          <div className="space-y-3 pt-2">
            {regularHours.map((slot) => (
              <div key={slot.id} className="grid grid-cols-8 gap-2 items-center">
                <div className="col-span-3">
                  <Select 
                    value={slot.day} 
                    onValueChange={(value) => updateTimeSlot(slot.id, 'day', value)}
                  >
                    <SelectTrigger id={`day-${slot.id}`}>
                      <SelectValue placeholder="Tag wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {DAYS.map((day) => (
                        <SelectItem key={day.value} value={day.value}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="col-span-2">
                  <Input 
                    type="time" 
                    value={slot.from}
                    onChange={(e) => updateTimeSlot(slot.id, 'from', e.target.value)}
                  />
                </div>
                
                <div className="col-span-2">
                  <Input 
                    type="time" 
                    value={slot.to}
                    onChange={(e) => updateTimeSlot(slot.id, 'to', e.target.value)}
                  />
                </div>
                
                <div className="col-span-1 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeTimeSlot(slot.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              className="mt-2 w-full"
              onClick={addTimeSlot}
            >
              <Plus className="h-4 w-4 mr-2" />
              Öffnungszeit hinzufügen
            </Button>
          </div>
        )}
      </div>
      
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Notdienst</h3>
            <p className="text-sm text-muted-foreground">
              Notdienstzeiten und Besonderheiten
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="emergencyHours" 
              checked={hasEmergencyHours}
              onCheckedChange={(checked) => {
                setHasEmergencyHours(checked);
                onChange();
              }}
            />
            <Label htmlFor="emergencyHours" className="cursor-pointer">
              Notdienst anbieten
            </Label>
          </div>
        </div>
        
        {hasEmergencyHours && (
          <div className="space-y-2">
            <Label>Notdienst-Information</Label>
            <p className="text-sm text-muted-foreground">
              Diese Funktion wird in einer zukünftigen Version verfügbar sein.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpeningHoursTab;
