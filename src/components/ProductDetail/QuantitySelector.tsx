
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
    <div className="flex items-center">
      <span className="mr-4">Menge</span>
      <div className="flex items-center border border-input rounded-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(-1)}
          disabled={quantity <= 1}
          className="h-9 w-9 rounded-none"
        >
          <Minus className="h-3 w-3" />
          <span className="sr-only">Menge verringern</span>
        </Button>

        <span className="w-12 text-center">{quantity} × 10g</span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onQuantityChange(1)}
          disabled={quantity >= 10}
          className="h-9 w-9 rounded-none"
        >
          <Plus className="h-3 w-3" />
          <span className="sr-only">Menge erhöhen</span>
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
