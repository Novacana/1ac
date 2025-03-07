
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { parsePercentage } from "./utils";

interface CannabinoidProfileProps {
  thc?: string;
  cbd?: string;
}

const CannabinoidProfile: React.FC<CannabinoidProfileProps> = ({ thc, cbd }) => {
  const [thcProgress, setThcProgress] = useState(0);
  const [cbdProgress, setCbdProgress] = useState(0);

  const thcValue = parsePercentage(thc);
  const cbdValue = parsePercentage(cbd);

  // Animate progress bars when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setThcProgress(thcValue);
      setCbdProgress(cbdValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [thcValue, cbdValue]);

  if (!thc && !cbd) return null;

  return (
    <div className="mb-1">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300">Cannabinoid</h4>
        <div className="flex gap-2 text-xs">
          {thc && <span className="font-medium">THC: {thc}</span>}
          {thc && cbd && <span>|</span>}
          {cbd && <span className="font-medium">CBD: {cbd}</span>}
        </div>
      </div>
      <div className="space-y-1 mt-1">
        {thc && (
          <Progress 
            value={thcProgress * 4} 
            max={100} 
            className="h-1 bg-primary/10"
          />
        )}
        
        {cbd && (
          <Progress 
            value={cbdProgress * 6.6} 
            max={100} 
            className="h-1 bg-primary/10 mt-1"
          />
        )}
      </div>
    </div>
  );
};

export default CannabinoidProfile;
