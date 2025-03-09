
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Partner } from "../../../PartnerConfig";

interface PartnerBusinessInfoProps {
  partner: Partner;
  onInputChange: (field: keyof Partner, value: string | boolean) => void;
}

export const PartnerBusinessInfo: React.FC<PartnerBusinessInfoProps> = ({ 
  partner, 
  onInputChange 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Input 
          id="address"
          value={partner.address}
          onChange={(e) => onInputChange('address', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="vat-id">USt-ID</Label>
        <Input 
          id="vat-id"
          value={partner.vatId || ""}
          onChange={(e) => onInputChange('vatId', e.target.value)}
        />
      </div>
    </>
  );
};
