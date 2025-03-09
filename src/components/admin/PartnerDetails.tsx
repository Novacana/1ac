
import React, { useState } from "react";
import { Partner, PartnerType } from "./PartnerConfig";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Save, 
  PiggyBank, 
  Users, 
  FileText, 
  Calendar, 
  Check, 
  Clock, 
  AlertTriangle,
  Plus
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface PartnerDetailsProps {
  partner: Partner;
  onUpdate: (partner: Partner) => void;
  onBack: () => void;
}

const PartnerDetails: React.FC<PartnerDetailsProps> = ({ partner, onUpdate, onBack }) => {
  const [editedPartner, setEditedPartner] = useState<Partner>({...partner});
  const [activeTab, setActiveTab] = useState("details");
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: "pending" as "paid" | "pending" | "overdue"
  });

  const handleSave = () => {
    onUpdate(editedPartner);
  };

  const handleAddPayment = () => {
    if (newPayment.amount <= 0) {
      toast.error("Bitte geben Sie einen gültigen Betrag ein");
      return;
    }

    const updatedPartner = { 
      ...editedPartner,
      payments: [
        ...(editedPartner.payments || []),
        { ...newPayment }
      ]
    };
    
    setEditedPartner(updatedPartner);
    setShowAddPaymentDialog(false);
    setNewPayment({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      status: "pending"
    });
    
    toast.success("Zahlung hinzugefügt");
  };

  const getPartnerTypeLabel = (type: PartnerType) => {
    switch (type) {
      case "pharmacy": return "Apotheke";
      case "growshop": return "Growshop";
      case "seedshop": return "Seedshop";
      case "doctor": return "Arzt";
    }
  };

  const getPaymentStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <Check className="h-4 w-4 text-green-500" />;
      case "pending": return <Clock className="h-4 w-4 text-amber-500" />;
      case "overdue": return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "paid": return "Bezahlt";
      case "pending": return "Ausstehend";
      case "overdue": return "Überfällig";
      default: return status;
    }
  };

  const calculateCommission = (revenue: number) => {
    return revenue * 0.042; // 4.20% commission
  };

  const totalCommission = calculateCommission(editedPartner.revenue || 0);
  const totalPaid = (editedPartner.payments || []).reduce(
    (sum, payment) => sum + (payment.status === "paid" ? payment.amount : 0), 
    0
  );
  const balance = totalCommission - totalPaid;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>{editedPartner.name}</CardTitle>
            </div>
            <Badge>
              {getPartnerTypeLabel(editedPartner.type)}
            </Badge>
          </div>
          <CardDescription>
            Partner seit {editedPartner.joinDate} | ID: {editedPartner.id}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="financial">
                <PiggyBank className="h-4 w-4 mr-2" />
                Finanzen
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Calendar className="h-4 w-4 mr-2" />
                Aktivität
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    value={editedPartner.name}
                    onChange={(e) => setEditedPartner({...editedPartner, name: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Typ</Label>
                  <select 
                    id="type"
                    className="w-full border border-input rounded-md px-3 py-2"
                    value={editedPartner.type}
                    onChange={(e) => setEditedPartner({...editedPartner, type: e.target.value as PartnerType})}
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
                    value={editedPartner.email}
                    onChange={(e) => setEditedPartner({...editedPartner, email: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input 
                    id="phone"
                    value={editedPartner.phone || ""}
                    onChange={(e) => setEditedPartner({...editedPartner, phone: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input 
                    id="address"
                    value={editedPartner.address}
                    onChange={(e) => setEditedPartner({...editedPartner, address: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="vat-id">USt-ID</Label>
                  <Input 
                    id="vat-id"
                    value={editedPartner.vatId || ""}
                    onChange={(e) => setEditedPartner({...editedPartner, vatId: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-person">Ansprechpartner</Label>
                  <Input 
                    id="contact-person"
                    value={editedPartner.contactPerson || ""}
                    onChange={(e) => setEditedPartner({...editedPartner, contactPerson: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      checked={editedPartner.active}
                      onCheckedChange={(checked) => setEditedPartner({...editedPartner, active: checked})}
                    />
                    <span className={editedPartner.active ? "text-green-600" : "text-gray-400"}>
                      {editedPartner.active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notizen</Label>
                <textarea 
                  id="notes"
                  className="w-full min-h-24 border border-input rounded-md px-3 py-2"
                  value={editedPartner.notes || ""}
                  onChange={(e) => setEditedPartner({...editedPartner, notes: e.target.value})}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Gesamtumsatz</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(editedPartner.revenue || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </div>
                    <div className="flex justify-between mt-2">
                      <Label htmlFor="revenue">Umsatz anpassen</Label>
                      <Input 
                        id="revenue"
                        type="number"
                        className="w-40 text-right"
                        value={editedPartner.revenue || 0}
                        onChange={(e) => setEditedPartner({
                          ...editedPartner, 
                          revenue: parseFloat(e.target.value) || 0
                        })}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Provision (4,20%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {totalCommission.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Basierend auf dem Gesamtumsatz des Partners
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Offener Betrag</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${balance > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                      {balance.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {balance > 0 ? 'Noch zu zahlen' : 'Vollständig bezahlt'}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Zahlungshistorie</CardTitle>
                    <CardDescription>Alle Zahlungen des Partners</CardDescription>
                  </div>
                  <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Zahlung hinzufügen
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Neue Zahlung hinzufügen</DialogTitle>
                        <DialogDescription>
                          Erfassen Sie eine neue Zahlung für diesen Partner
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="payment-date">Datum</Label>
                          <Input
                            id="payment-date"
                            type="date"
                            value={newPayment.date}
                            onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="payment-amount">Betrag (€)</Label>
                          <Input
                            id="payment-amount"
                            type="number"
                            step="0.01"
                            value={newPayment.amount}
                            onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value) || 0})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="payment-status">Status</Label>
                          <select
                            id="payment-status"
                            className="w-full border border-input rounded-md px-3 py-2"
                            value={newPayment.status}
                            onChange={(e) => setNewPayment({
                              ...newPayment, 
                              status: e.target.value as "paid" | "pending" | "overdue"
                            })}
                          >
                            <option value="paid">Bezahlt</option>
                            <option value="pending">Ausstehend</option>
                            <option value="overdue">Überfällig</option>
                          </select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>
                          Abbrechen
                        </Button>
                        <Button onClick={handleAddPayment}>
                          Zahlung hinzufügen
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Datum</TableHead>
                        <TableHead>Betrag</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(!editedPartner.payments || editedPartner.payments.length === 0) ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            Keine Zahlungen vorhanden
                          </TableCell>
                        </TableRow>
                      ) : (
                        editedPartner.payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{new Date(payment.date).toLocaleDateString('de-DE')}</TableCell>
                            <TableCell>{payment.amount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getPaymentStatusIcon(payment.status)}
                                {getPaymentStatusLabel(payment.status)}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitätsübersicht</CardTitle>
                  <CardDescription>
                    Übersicht der Partneraktivitäten (Bestellungen, Produkte, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-8 text-center text-muted-foreground">
                    <div>
                      <Users className="h-8 w-8 mx-auto mb-2" />
                      <p>Aktivitätsdaten werden in einer späteren Version verfügbar sein.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 border-t p-4">
          <Button variant="outline" onClick={onBack}>
            Abbrechen
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Änderungen speichern
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PartnerDetails;
