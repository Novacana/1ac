
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, ListPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Partner types
type PartnerType = "pharmacy" | "growshop" | "seedshop";

interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  email: string;
  address: string;
  active: boolean;
  joinDate: string;
  commissionPaid: boolean;
}

const PartnerConfig: React.FC = () => {
  // Demo data for partners
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: "p1",
      name: "Grüne Apotheke",
      type: "pharmacy",
      email: "kontakt@gruene-apotheke.de",
      address: "Hauptstraße 42, 10115 Berlin",
      active: true,
      joinDate: "2023-09-15",
      commissionPaid: true
    },
    {
      id: "p2",
      name: "Grow Experts GmbH",
      type: "growshop",
      email: "info@grow-experts.de",
      address: "Plantweg 20, 60313 Frankfurt",
      active: true,
      joinDate: "2023-10-22",
      commissionPaid: false
    },
    {
      id: "p3",
      name: "Seed Paradise",
      type: "seedshop",
      email: "hello@seedparadise.de",
      address: "Gartenstraße 15, 80331 München",
      active: false,
      joinDate: "2023-11-05",
      commissionPaid: true
    }
  ]);

  const [showAddPartner, setShowAddPartner] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    type: "pharmacy" as PartnerType,
    email: "",
    address: ""
  });

  const handleAddPartner = () => {
    // Validate form fields
    if (!newPartner.name || !newPartner.email || !newPartner.address) {
      toast.error("Bitte füllen Sie alle Pflichtfelder aus");
      return;
    }

    const partner: Partner = {
      id: `p${partners.length + 1}`,
      name: newPartner.name,
      type: newPartner.type,
      email: newPartner.email,
      address: newPartner.address,
      active: true,
      joinDate: new Date().toISOString().split('T')[0],
      commissionPaid: false
    };

    setPartners([...partners, partner]);
    setShowAddPartner(false);
    setNewPartner({
      name: "",
      type: "pharmacy",
      email: "",
      address: ""
    });

    toast.success(`Partner "${partner.name}" erfolgreich hinzugefügt`);
  };

  const togglePartnerStatus = (id: string) => {
    setPartners(partners.map(partner => 
      partner.id === id ? { ...partner, active: !partner.active } : partner
    ));

    const partner = partners.find(p => p.id === id);
    toast.success(`Partner "${partner?.name}" wurde ${!partner?.active ? 'aktiviert' : 'deaktiviert'}`);
  };

  const removePartner = (id: string) => {
    const partner = partners.find(p => p.id === id);
    
    toast.warning(`Partner "${partner?.name}" löschen?`, {
      action: {
        label: "Löschen",
        onClick: () => {
          setPartners(partners.filter(partner => partner.id !== id));
          toast.success(`Partner "${partner?.name}" erfolgreich gelöscht`);
        }
      },
      cancel: {
        label: "Abbrechen",
        onClick: () => {}
      }
    });
  };

  const getPartnerTypeLabel = (type: PartnerType) => {
    switch (type) {
      case "pharmacy": return "Apotheke";
      case "growshop": return "Growshop";
      case "seedshop": return "Seedshop";
    }
  };

  const getPartnerTypeBadgeVariant = (type: PartnerType) => {
    switch (type) {
      case "pharmacy": return "default";
      case "growshop": return "secondary";
      case "seedshop": return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Shop-Partner</h3>
          <p className="text-sm text-muted-foreground">
            Verwalten Sie alle angeschlossenen Partner und deren Status
          </p>
        </div>
        <Button 
          onClick={() => setShowAddPartner(!showAddPartner)} 
          className="flex items-center gap-2"
        >
          <ListPlus size={16} />
          Partner hinzufügen
        </Button>
      </div>

      {showAddPartner && (
        <Card>
          <CardHeader>
            <CardTitle>Neuen Partner hinzufügen</CardTitle>
            <CardDescription>
              Fügen Sie einen neuen Shop-Partner zur Plattform hinzu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="partner-name">Name</Label>
              <Input 
                id="partner-name" 
                value={newPartner.name}
                onChange={e => setNewPartner({...newPartner, name: e.target.value})}
                placeholder="Partner-Name" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partner-type">Typ</Label>
              <select 
                id="partner-type"
                className="w-full border border-input rounded-md px-3 py-2"
                value={newPartner.type}
                onChange={e => setNewPartner({...newPartner, type: e.target.value as PartnerType})}
              >
                <option value="pharmacy">Apotheke</option>
                <option value="growshop">Growshop</option>
                <option value="seedshop">Seedshop</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partner-email">E-Mail</Label>
              <Input 
                id="partner-email" 
                type="email" 
                value={newPartner.email}
                onChange={e => setNewPartner({...newPartner, email: e.target.value})}
                placeholder="partner@example.com" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="partner-address">Adresse</Label>
              <Input 
                id="partner-address" 
                value={newPartner.address}
                onChange={e => setNewPartner({...newPartner, address: e.target.value})}
                placeholder="Straße, PLZ Ort" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowAddPartner(false)}>Abbrechen</Button>
            <Button onClick={handleAddPartner}>Partner hinzufügen</Button>
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Partnerliste</CardTitle>
          <CardDescription>
            Alle angeschlossenen Partner und deren aktueller Status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Typ</TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Beitrittsdatum</TableHead>
                <TableHead>Provision bezahlt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Keine Partner gefunden. Fügen Sie neue Partner hinzu.
                  </TableCell>
                </TableRow>
              ) : (
                partners.map(partner => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        {partner.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPartnerTypeBadgeVariant(partner.type)}>
                        {getPartnerTypeLabel(partner.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{partner.email}</TableCell>
                    <TableCell>{partner.joinDate}</TableCell>
                    <TableCell>
                      {partner.commissionPaid ? (
                        <span className="text-green-600 font-medium">Ja</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Nein</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={partner.active}
                          onCheckedChange={() => togglePartnerStatus(partner.id)}
                        />
                        <span className={partner.active ? "text-green-600" : "text-gray-400"}>
                          {partner.active ? "Aktiv" : "Inaktiv"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removePartner(partner.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartnerConfig;
