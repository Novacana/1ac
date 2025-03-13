
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandCollapseButtonProps {
  isExpanded: boolean;
  onClick: () => void;
}

const ExpandCollapseButton: React.FC<ExpandCollapseButtonProps> = ({
  isExpanded,
  onClick,
}) => {
  return (
    <div className="flex justify-center mt-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onClick} 
        className="h-6 w-6 p-0 rounded-full"
      >
        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </Button>
    </div>
  );
};

export default ExpandCollapseButton;
