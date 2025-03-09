
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, ListPlus, Trash2, Edit, ArrowLeft } from "lucide-react";
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
import PartnerDetails from "./PartnerDetails";

// Partner types, expanded to include doctors
export type PartnerType = "pharmacy" | "growshop" | "seedshop" | "doctor";

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  email: string;
  address: string;
  active: boolean;
  joinDate: string;
  commissionPaid: boolean;
  revenue?: number;
  payments?: {
    date: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
  }[];
  contactPerson?: string;
  phone?: string;
  vatId?: string;
  notes?: string;
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
      commissionPaid: true,
      revenue: 12580.50,
      payments: [
        { date: "2023-10-01", amount: 528.38, status: "paid" },
        { date: "2023-11-01", amount: 452.15, status: "paid" },
        { date: "2023-12-01", amount: 498.72, status: "paid" }
      ],
      contactPerson: "Dr. Maria Schmidt",
      phone: "+49 30 123456",
      vatId: "DE123456789",
      notes: "Zuverlässiger Partner seit Beginn"
    },
    {
      id: "p2",
      name: "Grow Experts GmbH",
      type: "growshop",
      email: "info@grow-experts.de",
      address: "Plantweg 20, 60313 Frankfurt",
      active: true,
      joinDate: "2023-10-22",
      commissionPaid: false,
      revenue: 8920.75,
      payments: [
        { date: "2023-11-01", amount: 374.67, status: "paid" },
        { date: "2023-12-01", amount: 412.20, status: "overdue" }
      ],
      contactPerson: "Thomas Müller",
      phone: "+49 69 987654",
      vatId: "DE987654321"
    },
    {
      id: "p3",
      name: "Seed Paradise",
      type: "seedshop",
      email: "hello@seedparadise.de",
      address: "Gartenstraße 15, 80331 München",
      active: false,
      joinDate: "2023-11-05",
      commissionPaid: true,
      revenue: 3450.25,
      payments: [
        { date: "2023-12-01", amount: 144.91, status: "paid" }
      ],
      contactPerson: "Laura Becker",
      phone: "+49 89 456123"
    },
    {
      id: "p4",
      name: "Dr. med. Weber",
      type: "doctor",
      email: "dr.weber@medizin.de",
      address: "Praxisweg 10, 40213 Düsseldorf",
      active: true,
      joinDate: "2023-08-10",
      commissionPaid: true,
      revenue: 9870.00,
      payments: [
        { date: "2023-09-01", amount: 414.54, status: "paid" },
        { date: "2023-10-01", amount: 386.82, status: "paid" },
        { date: "2023-11-01", amount: 399.12, status: "paid" },
        { date: "2023-12-01", amount: 425.25, status: "pending" }
      ],
      contactPerson: "Dr. Johannes Weber",
      phone: "+49 211 789456",
      vatId: "DE567891234",
      notes: "Spezialisiert auf Cannabistherapie"
    }
  ]);

  const [showAddPartner, setShowAddPartner] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
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
      commissionPaid: false,
      revenue: 0,
      payments: []
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

  const viewPartnerDetails = (partner: Partner) => {
    setSelectedPartner(partner);
  };

  const updatePartner = (updatedPartner: Partner) => {
    setPartners(partners.map(p => 
      p.id === updatedPartner.id ? updatedPartner : p
    ));
    toast.success(`Partner "${updatedPartner.name}" wurde aktualisiert`);
  };

  const backToList = () => {
    setSelectedPartner(null);
  };

  const getPartnerTypeLabel = (type: PartnerType) => {
    switch (type) {
      case "pharmacy": return "Apotheke";
      case "growshop": return "Growshop";
      case "seedshop": return "Seedshop";
      case "doctor": return "Arzt";
    }
  };

  const getPartnerTypeBadgeVariant = (type: PartnerType) => {
    switch (type) {
      case "pharmacy": return "default";
      case "growshop": return "secondary";
      case "seedshop": return "outline";
      case "doctor": return "destructive";
    }
  };

  // If a partner is selected, show the details view
  if (selectedPartner) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={backToList}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück zur Partnerliste
          </Button>
          <h3 className="text-lg font-medium">Partner: {selectedPartner.name}</h3>
        </div>
        <PartnerDetails 
          partner={selectedPartner} 
          onUpdate={updatePartner}
          onBack={backToList}
        />
      </div>
    );
  }

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
                <option value="doctor">Arzt</option>
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
                <TableHead>Umsatz</TableHead>
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
                  <TableRow key={partner.id} className="cursor-pointer hover:bg-muted/80" onClick={() => viewPartnerDetails(partner)}>
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
                      {partner.revenue ? `${partner.revenue.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}` : '0,00 €'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={partner.active}
                          onCheckedChange={() => {
                            // This event handler was causing the error - fixed by directly calling togglePartnerStatus
                            togglePartnerStatus(partner.id);
                          }}
                          onClick={(e) => {
                            // Prevent the row click from triggering
                            e.stopPropagation();
                          }}
                        />
                        <span className={partner.active ? "text-green-600" : "text-gray-400"}>
                          {partner.active ? "Aktiv" : "Inaktiv"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewPartnerDetails(partner);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePartner(partner.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
