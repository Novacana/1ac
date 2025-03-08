
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (amount: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
}) => {
  return (
    <div className="flex items-center w-full">
      <span className="text-lg font-medium mr-2">Menge</span>
      <div className="flex items-center border border-border rounded-lg overflow-hidden shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
          className="h-10 w-10 rounded-none hover:bg-primary/10"
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Menge verringern</span>
        </Button>

        <div className="w-16 text-center font-medium">
          {quantity} × 10g
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(1)}
          disabled={quantity >= 10}
          className="h-10 w-10 rounded-none hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Menge erhöhen</span>
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
