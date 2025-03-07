
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ContactInfoForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kontaktinformation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Vorname</Label>
            <Input id="firstName" placeholder="Max" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nachname</Label>
            <Input id="lastName" placeholder="Mustermann" required />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" type="email" placeholder="max@beispiel.de" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefonnummer</Label>
          <Input id="phone" type="tel" placeholder="+49 123 456789" required />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoForm;
