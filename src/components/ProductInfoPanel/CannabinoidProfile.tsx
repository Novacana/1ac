
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Product } from "@/types/product";

interface CannabinoidProfileProps {
  product: Product;
}

export const CannabinoidProfile: React.FC<CannabinoidProfileProps> = ({ product }) => {
  const [thcProgress, setThcProgress] = useState(0);
  const [cbdProgress, setCbdProgress] = useState(0);

  const parsePercentage = (value: string | undefined) => {
    if (!value) return 0;
    const match = value.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  const thcValue = parsePercentage(product.thc);
  const cbdValue = parsePercentage(product.cbd);

  useEffect(() => {
    const timer = setTimeout(() => {
      setThcProgress(thcValue);
      setCbdProgress(cbdValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [thcValue, cbdValue]);

  return (
    <div className="mb-3">
      <h4 className="text-xs font-medium mb-1">Cannabinoid Profile</h4>
      <div className="space-y-2">
        {product.thc && (
          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span>THC</span>
              <span className="font-medium">{product.thc}</span>
            </div>
            <Progress value={thcProgress * 4} max={100} className="h-1.5 bg-primary/10" />
          </div>
        )}
        
        {product.cbd && (
          <div>
            <div className="flex justify-between text-xs mb-0.5">
              <span>CBD</span>
              <span className="font-medium">{product.cbd}</span>
            </div>
            <Progress value={cbdProgress * 6.6} max={100} className="h-1.5 bg-primary/10" />
          </div>
        )}
      </div>
    </div>
  );
};
