
import React from "react";
import { Button } from "@/components/ui/button";

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
    <div className="flex items-center justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="h-9 text-xs px-2"
      >
        Filter zurücksetzen
      </Button>
    </div>
  );
};

export default ResetButton;
