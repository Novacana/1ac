
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const ContactInfoForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Fill in user data if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      // Split name into first and last name
      const nameParts = user.name.split(" ");
      if (nameParts.length > 0) {
        setFirstName(nameParts[0]);
        // Join the rest of the name parts as the last name
        if (nameParts.length > 1) {
          setLastName(nameParts.slice(1).join(" "));
        }
      }
      
      // Set email from user data
      setEmail(user.email);
    }
  }, [user, isAuthenticated]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kontaktinformation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">Vorname</Label>
            <Input 
              id="firstName" 
              placeholder="Max" 
              required 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nachname</Label>
            <Input 
              id="lastName" 
              placeholder="Mustermann" 
              required 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="max@beispiel.de" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Telefonnummer</Label>
          <Input 
            id="phone" 
            type="tel" 
            placeholder="+49 123 456789" 
            required 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoForm;
