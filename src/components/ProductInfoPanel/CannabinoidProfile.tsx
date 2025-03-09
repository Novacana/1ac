
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { parsePercentage } from "./utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CannabinoidProfileProps {
  thc?: string;
  cbd?: string;
}

const CannabinoidProfile: React.FC<CannabinoidProfileProps> = ({ thc, cbd }) => {
  const [thcProgress, setThcProgress] = useState(0);
  const [cbdProgress, setCbdProgress] = useState(0);
  const isMobile = useIsMobile();

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
    <div className="mb-2">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-medium text-gray-600 dark:text-gray-300">Cannabinoid</h4>
        
        {isMobile ? (
          <div className="flex gap-2 text-xs">
            {thc && <span className="font-medium">THC: {thc}</span>}
            {thc && cbd && <span>|</span>}
            {cbd && <span className="font-medium">CBD: {cbd}</span>}
          </div>
        ) : (
          <div className="text-xs">
            <div className="flex items-center gap-1.5">
              {thc && (
                <div className="flex items-center gap-1">
                  <span className="bg-green-500 rounded-full h-2 w-2"></span>
                  <span className="font-semibold">THC:</span>
                  <span>{thc}</span>
                </div>
              )}
              {thc && cbd && <span className="mx-1">|</span>}
              {cbd && (
                <div className="flex items-center gap-1">
                  <span className="bg-blue-500 rounded-full h-2 w-2"></span>
                  <span className="font-semibold">CBD:</span>
                  <span>{cbd}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="space-y-1.5 mt-2">
        {thc && (
          <div className="space-y-0.5">
            {!isMobile && <span className="text-xs text-muted-foreground">THC</span>}
            <Progress 
              value={thcProgress * 4} 
              max={100} 
              className={`h-1.5 ${isMobile ? 'bg-primary/10' : 'bg-green-100'}`}
              style={{ 
                backgroundImage: isMobile ? undefined : 'linear-gradient(to right, rgba(0,0,0,0.03), rgba(0,0,0,0.05))'
              }}
            />
          </div>
        )}
        
        {cbd && (
          <div className="space-y-0.5">
            {!isMobile && <span className="text-xs text-muted-foreground">CBD</span>}
            <Progress 
              value={cbdProgress * 6.6} 
              max={100} 
              className={`h-1.5 ${isMobile ? 'bg-primary/10' : 'bg-blue-100'}`}
              style={{ 
                backgroundImage: isMobile ? undefined : 'linear-gradient(to right, rgba(0,0,0,0.03), rgba(0,0,0,0.05))'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CannabinoidProfile;
