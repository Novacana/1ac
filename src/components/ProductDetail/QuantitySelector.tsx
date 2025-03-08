
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (amount: number) => void;
  unit?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  unit = "10g"
}) => {
  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) {
      onQuantityChange(-1);
    }
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < 10) {
      onQuantityChange(1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-medium">Menge</span>
      <div className="flex items-center border border-input rounded-lg overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="h-10 w-10 rounded-none"
          type="button"
        >
          <Minus className="h-4 w-4" />
          <span className="sr-only">Menge verringern</span>
        </Button>

        <div className="w-16 text-center font-medium">
          {quantity} {unit && `× ${unit}`}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleIncrease}
          disabled={quantity >= 10}
          className="h-10 w-10 rounded-none"
          type="button"
        >
          <Plus className="h-4 w-4" />
          <span className="sr-only">Menge erhöhen</span>
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
