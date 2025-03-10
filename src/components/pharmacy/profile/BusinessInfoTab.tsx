
import React, { useState } from "react";
import { User } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BusinessInfoTabProps {
  user: User | null;
  onChange: () => void;
}

const BusinessInfoTab: React.FC<BusinessInfoTabProps> = ({ user, onChange }) => {
  const [businessName, setBusinessName] = useState(user?.name || "");
  const [businessType, setBusinessType] = useState("standard");
  const [description, setDescription] = useState("");
  const [yearEstablished, setYearEstablished] = useState("");
  const [licenseNumber, setLicenseNumber] = useState(user?.pharmacyLicenseNumber || "");
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Apotheken-Name*</Label>
          <Input 
            id="businessName" 
            value={businessName}
            onChange={(e) => {
              setBusinessName(e.target.value);
              onChange();
            }}
            placeholder="Name Ihrer Apotheke"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessType">Apothekentyp</Label>
          <Select 
            value={businessType} 
            onValueChange={(value) => {
              setBusinessType(value);
              onChange();
            }}
          >
            <SelectTrigger id="businessType">
              <SelectValue placeholder="Wählen Sie den Apothekentyp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard Apotheke</SelectItem>
              <SelectItem value="online">Online Apotheke</SelectItem>
              <SelectItem value="compounding">Compounding Apotheke</SelectItem>
              <SelectItem value="hospital">Krankenhausapotheke</SelectItem>
              <SelectItem value="special">Spezialisierte Apotheke</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea 
          id="description" 
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            onChange();
          }}
          placeholder="Beschreiben Sie Ihre Apotheke, Spezialisierungen und besondere Dienstleistungen"
          className="min-h-[120px]"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="yearEstablished">Gründungsjahr</Label>
          <Input 
            id="yearEstablished" 
            type="number"
            min="1800"
            max={new Date().getFullYear()}
            value={yearEstablished}
            onChange={(e) => {
              setYearEstablished(e.target.value);
              onChange();
            }}
            placeholder="z.B. 1985"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">Apotheken-Lizenznummer*</Label>
          <Input 
            id="licenseNumber" 
            value={licenseNumber}
            onChange={(e) => {
              setLicenseNumber(e.target.value);
              onChange();
            }}
            placeholder="Ihre offizielle Lizenznummer"
          />
          <p className="text-sm text-muted-foreground">
            Diese Nummer wird für die Verifizierung benötigt
          </p>
        </div>
      </div>
      
      <div className="pt-4 text-sm text-muted-foreground">
        * Pflichtfelder
      </div>
    </div>
  );
};

export default BusinessInfoTab;
