
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface CannabinoidProfileProps {
  thc?: string;
  cbd?: string;
}

export const CannabinoidProfile: React.FC<CannabinoidProfileProps> = ({ thc, cbd }) => {
  const [thcProgress, setThcProgress] = useState(0);
  const [cbdProgress, setCbdProgress] = useState(0);

  // Parse THC and CBD values
  const parsePercentage = (value: string | undefined) => {
    if (!value) return 0;
    const match = value.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  const thcValue = parsePercentage(thc);
  const cbdValue = parsePercentage(cbd);

  // Calculate ratio when both values are present
  const getRatio = () => {
    if (thcValue && cbdValue) {
      const ratio = (thcValue / cbdValue).toFixed(1);
      return `${ratio}:1 THC:CBD`;
    }
    return null;
  };

  // Animate progress bars when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setThcProgress(thcValue);
      setCbdProgress(cbdValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [thcValue, cbdValue]);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-xs font-medium">Cannabinoid Profile</h4>
        {thcValue && cbdValue && (
          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
            {getRatio()}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {thc && (
          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span>THC</span>
              <span className="font-medium">{thc}</span>
            </div>
            <Progress 
              value={thcProgress * 4} 
              max={100} 
              className="h-1.5 bg-primary/10"
            />
          </div>
        )}
        
        {cbd && (
          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span>CBD</span>
              <span className="font-medium">{cbd}</span>
            </div>
            <Progress 
              value={cbdProgress * 6.6} 
              max={100} 
              className="h-1.5 bg-primary/10"
            />
          </div>
        )}
      </div>
    </div>
  );
};
