
import React from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

interface MobileUserButtonProps {
  isAuthenticated: boolean;
  isDoctor: boolean;
  onClick: () => void;
}

const MobileUserButton: React.FC<MobileUserButtonProps> = ({
  isAuthenticated,
  isDoctor,
  onClick
}) => {
  const location = useLocation();
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
        location.pathname === '/dashboard' || location.pathname === '/doctor/dashboard'
          ? "bg-primary text-white"
          : "bg-background/70 text-foreground shadow-sm"
      )}
      aria-label="Zum Benutzerkonto"
    >
      <User size={20} />
    </button>
  );
};

export default MobileUserButton;
