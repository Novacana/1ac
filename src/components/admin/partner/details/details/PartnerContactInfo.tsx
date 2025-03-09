
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Partner } from "../../../PartnerConfig";

interface PartnerContactInfoProps {
  partner: Partner;
  onInputChange: (field: keyof Partner, value: string | boolean) => void;
}

export const PartnerContactInfo: React.FC<PartnerContactInfoProps> = ({ 
  partner, 
  onInputChange 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="email">E-Mail</Label>
        <Input 
          id="email"
          type="email"
          value={partner.email}
          onChange={(e) => onInputChange('email', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Telefon</Label>
        <Input 
          id="phone"
          value={partner.phone || ""}
          onChange={(e) => onInputChange('phone', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="contact-person">Ansprechpartner</Label>
        <Input 
          id="contact-person"
          value={partner.contactPerson || ""}
          onChange={(e) => onInputChange('contactPerson', e.target.value)}
        />
      </div>
    </>
  );
};
