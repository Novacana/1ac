
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar as CalendarIcon, Video, Clock, FileText, Users } from "lucide-react";
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { CalendarView } from './types';

interface CalendarSidebarProps {
  date: Date;
  view: CalendarView;
  onDateChange: (date: Date) => void;
  onViewChange: (view: CalendarView) => void;
  eventDays: Date[];
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  date,
  view,
  onDateChange,
  onViewChange,
  eventDays
}) => {
  return (
    <Card className="p-4 lg:col-span-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(date, "PPPP", { locale: de })}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && onDateChange(newDate)}
            modifiers={{ booked: eventDays }}
            modifiersStyles={{ booked: { fontWeight: 'bold', backgroundColor: 'rgba(34, 197, 94, 0.1)' } }}
            className="p-3 pointer-events-auto"
            locale={de}
          />
        </PopoverContent>
      </Popover>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Kalenderansicht</h3>
        <Tabs defaultValue={view} value={view} onValueChange={(v) => onViewChange(v as CalendarView)}>
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="day">Tag</TabsTrigger>
            <TabsTrigger value="week">Woche</TabsTrigger>
            <TabsTrigger value="month">Monat</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Termintypen</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-green-500">
              <Video className="h-3 w-3 mr-1" />
              Videosprechstunde
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500">
              <Clock className="h-3 w-3 mr-1" />
              Termin
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-500">
              <FileText className="h-3 w-3 mr-1" />
              Rezeptverwaltung
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-purple-500">
              <Users className="h-3 w-3 mr-1" />
              Patiententermin
            </Badge>
          </div>
        </div>
      </div>

      <Alert className="mt-6">
        <AlertDescription className="text-xs">
          Gemäß DSGVO werden alle Kalenderdaten verschlüsselt übertragen und gespeichert. 
          Patientendaten werden nur in pseudonymisierter Form mit externen Kalendern synchronisiert.
        </AlertDescription>
      </Alert>
    </Card>
  );
};

export default CalendarSidebar;
