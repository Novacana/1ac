import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Partner } from "../../PartnerConfig";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Check, Clock, AlertTriangle, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface FinancialTabProps {
  partner: Partner;
  onChange: (updatedPartner: Partner) => void;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ partner, onChange }) => {
  const [showAddPaymentDialog, setShowAddPaymentDialog] = React.useState(false);
  const [newPayment, setNewPayment] = React.useState({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    status: "pending" as "paid" | "pending" | "overdue"
  });

  const calculateCommission = (revenue: number) => {
    return revenue * 0.042; // 4.20% commission
  };

  const totalCommission = calculateCommission(partner.revenue || 0);
  const totalPaid = (partner.payments || []).reduce(
    (sum, payment) => sum + (payment.status === "paid" ? payment.amount : 0), 
    0
  );
  const balance = totalCommission - totalPaid;

  const handleAddPayment = () => {
    if (newPayment.amount <= 0) {
      toast.error("Bitte geben Sie einen gültigen Betrag ein");
      return;
    }

    const updatedPartner = { 
      ...partner,
      payments: [
        ...(partner.payments || []),
        { ...newPayment }
      ]
    };
    
    onChange(updatedPartner);
    setShowAddPaymentDialog(false);
    setNewPayment({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      status: "pending"
    });
    
    toast.success("Zahlung hinzugefügt");
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Gesamtumsatz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(partner.revenue || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </div>
            <div className="flex justify-between mt-2">
              <Label htmlFor="revenue">Umsatz anpassen</Label>
              <Input 
                id="revenue"
                type="number"
                className="w-40 text-right"
                value={partner.revenue || 0}
                onChange={(e) => onChange({
                  ...partner, 
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
              {(!partner.payments || partner.payments.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    Keine Zahlungen vorhanden
                  </TableCell>
                </TableRow>
              ) : (
                partner.payments.sort((a, b) => 
                  new Date(b.date).getTime() - new Date(a.date).getTime()
                ).map((payment, index) => (
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
    </div>
  );
};

export default FinancialTab;
