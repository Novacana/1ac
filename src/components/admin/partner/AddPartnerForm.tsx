
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PartnerType } from "../PartnerConfig";

interface AddPartnerFormProps {
  onAddPartner: (newPartner: AddPartnerData) => void;
  onCancel: () => void;
}

type AddPartnerData = {
  name: string;
  type: PartnerType;
  email: string;
  address: string;
  contactPerson?: string;
  phone?: string;
  vatId?: string;
  notes?: string;
};

const AddPartnerForm: React.FC<AddPartnerFormProps> = ({ onAddPartner, onCancel }) => {
  const [newPartner, setNewPartner] = useState<AddPartnerData>({
    name: "",
    type: "pharmacy" as PartnerType,
    email: "",
    address: "",
    contactPerson: "",
    phone: "",
    vatId: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPartner({
      ...newPartner,
      [id.replace('partner-', '')]: value
    });
  };

  const handleSubmit = () => {
    // Validate form fields
    if (!newPartner.name || !newPartner.email || !newPartner.address) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }

    onAddPartner(newPartner);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neuen Partner hinzufügen</CardTitle>
        <CardDescription>
          Fügen Sie einen neuen Shop-Partner zur Plattform hinzu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="partner-name">Name *</Label>
          <Input 
            id="partner-name" 
            value={newPartner.name}
            onChange={handleInputChange}
            placeholder="Partner-Name" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="partner-type">Typ *</Label>
          <Select 
            value={newPartner.type} 
            onValueChange={(value) => setNewPartner({...newPartner, type: value as PartnerType})}
          >
            <SelectTrigger id="partner-type">
              <SelectValue placeholder="Partner-Typ auswählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pharmacy">Apotheke</SelectItem>
              <SelectItem value="growshop">Growshop</SelectItem>
              <SelectItem value="seedshop">Seedshop</SelectItem>
              <SelectItem value="doctor">Arzt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="partner-email">E-Mail *</Label>
          <Input 
            id="partner-email" 
            type="email" 
            value={newPartner.email}
            onChange={handleInputChange}
            placeholder="partner@example.com" 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="partner-address">Adresse *</Label>
          <Input 
            id="partner-address" 
            value={newPartner.address}
            onChange={handleInputChange}
            placeholder="Straße, PLZ Ort" 
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partner-contactPerson">Ansprechpartner</Label>
          <Input 
            id="partner-contactPerson" 
            value={newPartner.contactPerson}
            onChange={handleInputChange}
            placeholder="Name des Ansprechpartners" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partner-phone">Telefon</Label>
          <Input 
            id="partner-phone" 
            value={newPartner.phone}
            onChange={handleInputChange}
            placeholder="+49 123 456789" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partner-vatId">USt-IdNr.</Label>
          <Input 
            id="partner-vatId" 
            value={newPartner.vatId}
            onChange={handleInputChange}
            placeholder="DE123456789" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partner-notes">Anmerkungen</Label>
          <Input 
            id="partner-notes" 
            value={newPartner.notes}
            onChange={handleInputChange}
            placeholder="Zusätzliche Informationen" 
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Abbrechen</Button>
        <Button onClick={handleSubmit}>Partner hinzufügen</Button>
      </CardFooter>
    </Card>
  );
};

export default AddPartnerForm;
