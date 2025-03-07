
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ShippingAddressForm: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lieferadresse</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="address">Straße und Hausnummer</Label>
          <Input id="address" placeholder="Musterstraße 123" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="apt">Adresszusatz (optional)</Label>
          <Input id="apt" placeholder="Wohnung 4B" />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Stadt</Label>
            <Input id="city" placeholder="Berlin" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Bundesland</Label>
            <Input id="state" placeholder="Berlin" required />
          </div>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="zip">Postleitzahl</Label>
            <Input id="zip" placeholder="10115" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Land</Label>
            <Input id="country" placeholder="Deutschland" required />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex items-center space-x-2">
          <Checkbox id="sameAsBilling" />
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
