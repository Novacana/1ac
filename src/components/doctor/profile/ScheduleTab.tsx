
import React from "react";

interface ScheduleTabProps {
  setHasUnsavedChanges: (value: boolean) => void;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ setHasUnsavedChanges }) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/30 p-6 rounded-lg border">
        <h3 className="text-lg font-medium mb-4">Sprechzeiten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Montag</label>
            <div className="flex gap-2 mt-1">
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                defaultValue="09:00"
                onChange={() => setHasUnsavedChanges(true)}
              />
              <span className="flex items-center">-</span>
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                defaultValue="17:00"
                onChange={() => setHasUnsavedChanges(true)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Dienstag</label>
            <div className="flex gap-2 mt-1">
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                defaultValue="09:00"
                onChange={() => setHasUnsavedChanges(true)}
              />
              <span className="flex items-center">-</span>
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                defaultValue="17:00"
                onChange={() => setHasUnsavedChanges(true)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Mittwoch</label>
            <div className="flex gap-2 mt-1">
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                defaultValue="09:00"
                onChange={() => setHasUnsavedChanges(true)}
              />
              <span className="flex items-center">-</span>
              <input 
                type="time" 
                className="w-full p-2 border rounded-md" 
                defaultValue="17:00"
                onChange={() => setHasUnsavedChanges(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTab;
