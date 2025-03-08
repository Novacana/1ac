
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Book, Info } from "lucide-react";

interface QuickActionsProps {
  onActionClick: (action: string) => void;
  onNavigate: (path: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick, onNavigate }) => {
  const renderToolButton = (icon: React.ReactNode, label: string, onClick: () => void) => {
    return (
      <Button 
        variant="outline"
        size="sm"
        onClick={onClick}
        className="bg-secondary/20 border-secondary/40 hover:bg-secondary/30 gap-1.5"
      >
        {icon}
        <span className="text-xs">{label}</span>
      </Button>
    );
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-2">
      {renderToolButton(
        <Search className="h-3.5 w-3.5" />, 
        "Produktsuche", 
        () => onActionClick("Zeig mir Produkte für Schmerzen")
      )}
      {renderToolButton(
        <ShoppingCart className="h-3.5 w-3.5" />, 
        "Warenkorb", 
        () => onNavigate('/cart')
      )}
      {renderToolButton(
        <Book className="h-3.5 w-3.5" />, 
        "Produkte", 
        () => onNavigate('/products')
      )}
      {renderToolButton(
        <Info className="h-3.5 w-3.5" />, 
        "Was ist CBD?", 
        () => onActionClick("Was ist CBD?")
      )}
    </div>
  );
};

export default QuickActions;
