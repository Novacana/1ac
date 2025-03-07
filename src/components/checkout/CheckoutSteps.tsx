
import React from "react";

type CheckoutStepsProps = {
  currentStep: number;
};

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            1
          </div>
          <div className="ml-2 font-medium">Information</div>
        </div>
        
        <div className="bg-muted h-0.5 flex-1 mx-4" />
        
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            2
          </div>
          <div className="ml-2 font-medium">Zahlung</div>
        </div>
        
        <div className="bg-muted h-0.5 flex-1 mx-4" />
        
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            3
          </div>
          <div className="ml-2 font-medium">Bestätigung</div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;
