
import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarHeaderProps {
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onNewEvent: () => void;
  onSyncClick: () => void;
  dateHeader: string;
  showNavigation?: boolean;
  showMainTitle?: boolean;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  onPrevious,
  onNext,
  onToday,
  onNewEvent,
  onSyncClick,
  dateHeader,
  showNavigation = true,
  showMainTitle = true
}) => {
  return (
    <>
      {showMainTitle && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Arzt-Kalender</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={onSyncClick}
            >
              <RefreshCw className="h-4 w-4" />
              Kalender synchronisieren
            </Button>
            <Button className="flex items-center gap-2" onClick={onNewEvent}>
              <Plus className="h-4 w-4" />
              Neuer Termin
            </Button>
          </div>
        </div>
      )}

      {showNavigation && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={onPrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onToday}>
              Heute
            </Button>
            <Button size="sm" variant="outline" onClick={onNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <h3 className="text-lg font-medium">{dateHeader}</h3>
        </div>
      )}
    </>
  );
};

export default CalendarHeader;
