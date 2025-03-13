
import React from "react";
import { Slider } from "@/components/ui/slider";

interface RangeSliderProps {
  label: string;
  unit: string;
  currentRange: [number, number];
  maxValue: number;
  onValueChange: (value: [number, number]) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  label,
  unit,
  currentRange,
  maxValue,
  onValueChange,
}) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm text-muted-foreground">
          {currentRange[0]}{unit} - {currentRange[1]}{unit}
        </span>
      </div>
      <Slider
        defaultValue={[0, maxValue]}
        value={[currentRange[0], currentRange[1]]}
        max={maxValue}
        step={1}
        onValueChange={(value) => onValueChange([value[0], value[1]] as [number, number])}
        className="mb-4"
      />
    </div>
  );
};

export default RangeSlider;
