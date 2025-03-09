
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Check, Clock, AlertTriangle, Plus } from "lucide-react";
import { Partner } from "../../../PartnerConfig";

interface PaymentHistoryProps {
  partner: Partner;
  onAddPaymentClick: () => void;
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ partner, onAddPaymentClick }) => {
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
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Zahlungshistorie</CardTitle>
          <CardDescription>Alle Zahlungen des Partners</CardDescription>
        </div>
        <Button size="sm" onClick={onAddPaymentClick}>
          <Plus className="h-4 w-4 mr-1" />
          Zahlung hinzufügen
        </Button>
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
  );
};

export default PaymentHistory;
