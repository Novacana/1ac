
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NotificationsToggleProps {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
}

const NotificationsToggle: React.FC<NotificationsToggleProps> = ({
  notificationsEnabled,
  setNotificationsEnabled,
}) => {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="notifications" className="text-right">
        Benachrichtigungen
      </Label>
      <div className="flex items-center space-x-2 col-span-3">
        <Switch
          id="notifications"
          checked={notificationsEnabled}
          onCheckedChange={setNotificationsEnabled}
          className="data-[state=checked]:bg-green-500"
        />
        <Label htmlFor="notifications" className="text-sm">
          {notificationsEnabled ? "Aktiviert" : "Deaktiviert"}
        </Label>
      </div>
    </div>
  );
};

export default NotificationsToggle;
