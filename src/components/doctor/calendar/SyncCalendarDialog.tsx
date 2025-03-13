
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink } from "lucide-react";
import { CalendarSyncOption } from './types';

interface SyncCalendarDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSyncCalendars: () => void;
  syncOptions: CalendarSyncOption[];
}

const SyncCalendarDialog: React.FC<SyncCalendarDialogProps> = ({
  isOpen,
  onOpenChange,
  onSyncCalendars,
  syncOptions
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Kalender synchronisieren</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm">Wählen Sie einen Kalenderdienst zur Synchronisation aus:</p>
          <div className="space-y-2">
            {syncOptions.map((option) => (
              <div 
                key={option.id}
                className="flex items-center justify-between p-3 border rounded hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  {option.id === 'google' && <div className="w-5 h-5 bg-red-500 rounded-full" />}
                  {option.id === 'outlook' && <div className="w-5 h-5 bg-blue-500 rounded-full" />}
                  {option.id === 'apple' && <div className="w-5 h-5 bg-gray-800 rounded-full" />}
                  {option.id === 'caldav' && <div className="w-5 h-5 bg-purple-500 rounded-full" />}
                  <span>{option.name}</span>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
          
          <Alert>
            <AlertDescription className="text-xs">
              Bei der Synchronisation werden keine sensiblen Patientendaten übertragen. 
              Patientennamen werden pseudonymisiert und Notizen werden nicht synchronisiert.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Abbrechen</Button>
          <Button onClick={onSyncCalendars}>Synchronisieren</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncCalendarDialog;
