
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Partner, PartnerType } from "../../PartnerConfig";

interface DetailsTabProps {
  partner: Partner;
  onChange: (updatedPartner: Partner) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ partner, onChange }) => {
  const handleInputChange = (field: keyof Partner, value: string | boolean) => {
    onChange({
      ...partner,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name"
            value={partner.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Typ</Label>
          <select 
            id="type"
            className="w-full border border-input rounded-md px-3 py-2"
            value={partner.type}
            onChange={(e) => handleInputChange('type', e.target.value as PartnerType)}
          >
            <option value="pharmacy">Apotheke</option>
            <option value="growshop">Growshop</option>
            <option value="seedshop">Seedshop</option>
            <option value="doctor">Arzt</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input 
            id="email"
            type="email"
            value={partner.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input 
            id="phone"
            value={partner.phone || ""}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input 
            id="address"
            value={partner.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="vat-id">USt-ID</Label>
          <Input 
            id="vat-id"
            value={partner.vatId || ""}
            onChange={(e) => handleInputChange('vatId', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact-person">Ansprechpartner</Label>
          <Input 
            id="contact-person"
            value={partner.contactPerson || ""}
            onChange={(e) => handleInputChange('contactPerson', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              checked={partner.active}
              onCheckedChange={(checked) => handleInputChange('active', checked)}
            />
            <span className={partner.active ? "text-green-600" : "text-gray-400"}>
              {partner.active ? "Aktiv" : "Inaktiv"}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notizen</Label>
        <textarea 
          id="notes"
          className="w-full min-h-24 border border-input rounded-md px-3 py-2"
          value={partner.notes || ""}
          onChange={(e) => handleInputChange('notes', e.target.value)}
        />
      </div>
    </div>
  );
};

export default DetailsTab;
