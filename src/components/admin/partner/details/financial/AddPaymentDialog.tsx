
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AddPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newPayment: {
    date: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
  };
  setNewPayment: React.Dispatch<React.SetStateAction<{
    date: string;
    amount: number;
    status: "paid" | "pending" | "overdue";
  }>>;
  onAddPayment: () => void;
}

const AddPaymentDialog: React.FC<AddPaymentDialogProps> = ({
  open,
  onOpenChange,
  newPayment,
  setNewPayment,
  onAddPayment
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={onAddPayment}>
            Zahlung hinzufügen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPaymentDialog;
