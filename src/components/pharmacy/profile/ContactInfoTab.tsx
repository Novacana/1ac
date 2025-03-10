
import React, { useState } from "react";
import { User } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ContactInfoTabProps {
  user: User | null;
  onChange: () => void;
}

const ContactInfoTab: React.FC<ContactInfoTabProps> = ({ user, onChange }) => {
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [website, setWebsite] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPosition, setContactPosition] = useState("");
  const [showContactInfo, setShowContactInfo] = useState(true);
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Öffentliche Kontaktdaten</h3>
        <p className="text-sm text-muted-foreground">
          Diese Informationen werden öffentlich in Ihrem Apothekenprofil angezeigt
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefonnummer*</Label>
            <Input 
              id="phone" 
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                onChange();
              }}
              placeholder="+49 123 456789"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail*</Label>
            <Input 
              id="email" 
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                onChange();
              }}
              placeholder="apotheke@beispiel.de"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input 
            id="website" 
            type="url"
            value={website}
            onChange={(e) => {
              setWebsite(e.target.value);
              onChange();
            }}
            placeholder="https://www.ihre-apotheke.de"
          />
        </div>
      </div>
      
      <div className="border-t pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Ansprechpartner</h3>
            <p className="text-sm text-muted-foreground">
              Kontaktperson für Ihre Apotheke
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="showContact" 
              checked={showContactInfo}
              onCheckedChange={(checked) => {
                setShowContactInfo(checked);
                onChange();
              }}
            />
            <Label htmlFor="showContact" className="cursor-pointer">
              Öffentlich anzeigen
            </Label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">Name</Label>
            <Input 
              id="contactName" 
              value={contactName}
              onChange={(e) => {
                setContactName(e.target.value);
                onChange();
              }}
              placeholder="Max Mustermann"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contactPosition">Position</Label>
            <Input 
              id="contactPosition" 
              value={contactPosition}
              onChange={(e) => {
                setContactPosition(e.target.value);
                onChange();
              }}
              placeholder="Apothekenleiter"
            />
          </div>
        </div>
      </div>
      
      <div className="pt-4 text-sm text-muted-foreground">
        * Pflichtfelder
      </div>
    </div>
  );
};

export default ContactInfoTab;
