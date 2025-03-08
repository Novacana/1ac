
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const ShippingAddressForm: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [address, setAddress] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("Deutschland");
  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Fill in user data if logged in
  useEffect(() => {
    if (isAuthenticated && user && user.address) {
      setAddress(user.address.street || "");
      setAdditionalInfo(user.address.additionalInfo || "");
      setCity(user.address.city || "");
      setState(user.address.state || "");
      setZip(user.address.zip || "");
      setCountry(user.address.country || "Deutschland");
    }
  }, [user, isAuthenticated]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lieferadresse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="address">Straße und Hausnummer</Label>
          <Input 
            id="address" 
            placeholder="Musterstraße 123" 
            required 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="apt">Adresszusatz (optional)</Label>
          <Input 
            id="apt" 
            placeholder="Wohnung 4B" 
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Stadt</Label>
            <Input 
              id="city" 
              placeholder="Berlin" 
              required 
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Bundesland</Label>
            <Input 
              id="state" 
              placeholder="Berlin" 
              required 
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="zip">Postleitzahl</Label>
            <Input 
              id="zip" 
              placeholder="10115" 
              required 
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Land</Label>
            <Input 
              id="country" 
              placeholder="Deutschland" 
              required 
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="sameAsBilling" 
            checked={sameAsBilling} 
            onCheckedChange={(checked) => setSameAsBilling(checked === true)}
          />
          <label
            htmlFor="sameAsBilling"
            className="text-sm text-muted-foreground cursor-pointer"
          >
            Rechnungsadresse ist identisch mit Lieferadresse
          </label>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ShippingAddressForm;
