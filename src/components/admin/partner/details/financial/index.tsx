
import React, { useState } from "react";
import { Partner } from "../../../PartnerConfig";
import { toast } from "sonner";
import FinancialOverview from "./FinancialOverview";
import PaymentHistory from "./PaymentHistory";
import AddPaymentDialog from "./AddPaymentDialog";

interface FinancialTabProps {
  partner: Partner;
  onChange: (updatedPartner: Partner) => void;
}

const FinancialTab: React.FC<FinancialTabProps> = ({ partner, onChange }) => {
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [newPayment, setNewPayment] = useState({
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

  return (
    <div className="space-y-6">
      <FinancialOverview 
        partner={partner}
        onChange={onChange}
        totalCommission={totalCommission}
        totalPaid={totalPaid}
        balance={balance}
      />
      
      <PaymentHistory 
        partner={partner}
        onAddPaymentClick={() => setShowAddPaymentDialog(true)}
      />
      
      <AddPaymentDialog
        open={showAddPaymentDialog}
        onOpenChange={setShowAddPaymentDialog}
        newPayment={newPayment}
        setNewPayment={setNewPayment}
        onAddPayment={handleAddPayment}
      />
    </div>
  );
};

export default FinancialTab;
