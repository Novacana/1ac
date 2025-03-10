
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaymentConsentCheckProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  required?: boolean;
}

const PaymentConsentCheck: React.FC<PaymentConsentCheckProps> = ({
  checked,
  onCheckedChange,
  required = true
}) => {
  return (
    <div className="flex items-start space-x-2 pt-4">
      <Checkbox 
        id="payment-consent" 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        required={required}
        className="mt-1"
      />
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Label 
            htmlFor="payment-consent" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Ich stimme der Verarbeitung meiner Zahlungsdaten gemäß der{' '}
            <Link to="/datenschutz" className="text-primary hover:underline">
              Datenschutzrichtlinie
            </Link>{' '}
            zu
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Ihre Zahlungsdaten werden gemäß der DSGVO (GDPR) sicher verarbeitet und nur für die 
                  Abwicklung Ihrer Bestellung verwendet. Es wird eine Plattformgebühr von 4,20% für 
                  jede Bestellung oder vermittelte Rezeptanfrage erhoben.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-xs text-muted-foreground">
          Ich bin damit einverstanden, dass für diese Transaktion eine Plattformgebühr von 4,20% erhoben wird.
          {required && <span className="text-red-500 ml-1">*</span>}
        </p>
      </div>
    </div>
  );
};

export default PaymentConsentCheck;
