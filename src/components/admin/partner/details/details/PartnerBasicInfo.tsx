
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Partner, PartnerType } from "../../../PartnerConfig";

interface PartnerBasicInfoProps {
  partner: Partner;
  onInputChange: (field: keyof Partner, value: string | boolean) => void;
}

export const PartnerBasicInfo: React.FC<PartnerBasicInfoProps> = ({ 
  partner, 
  onInputChange 
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name"
          value={partner.name}
          onChange={(e) => onInputChange('name', e.target.value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Typ</Label>
        <select 
          id="type"
          className="w-full border border-input rounded-md px-3 py-2"
          value={partner.type}
          onChange={(e) => onInputChange('type', e.target.value as PartnerType)}
        >
          <option value="pharmacy">Apotheke</option>
          <option value="growshop">Growshop</option>
          <option value="seedshop">Seedshop</option>
          <option value="doctor">Arzt</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            checked={partner.active}
            onCheckedChange={(checked) => onInputChange('active', checked)}
          />
          <span className={partner.active ? "text-green-600" : "text-gray-400"}>
            {partner.active ? "Aktiv" : "Inaktiv"}
          </span>
        </div>
      </div>
    </>
  );
};
