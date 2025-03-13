
import React from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentTabProps {
  statistics: {
    prescriptionsCount: number;
    patientsCount: number;
    consultationsCount: number;
    totalRevenue: number;
  };
}

const PaymentTab: React.FC<PaymentTabProps> = ({ statistics }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Abrechnungsinformationen</h3>
      <div className="bg-muted/30 rounded-lg p-6 border">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Aktuelle Periode</span>
          <span>{new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-medium">Bearbeitete Rezepte</span>
          <span>{statistics.prescriptionsCount}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-medium">Ausstehender Betrag</span>
          <span className="font-bold">€{(statistics.prescriptionsCount * 20).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Nächste Auszahlung</span>
          <span>{new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString('de-DE')}</span>
        </div>
      </div>
      
      <h3 className="text-lg font-medium pt-4">Zahlungsmethoden</h3>
      <div className="bg-muted/30 rounded-lg p-6 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-10 w-10 text-primary" />
            <div>
              <p className="font-medium">SEPA-Bankverbindung</p>
              <p className="text-sm text-muted-foreground">DE89 3704 0044 0532 0130 00</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Bearbeiten</Button>
        </div>
      </div>
      
      <Button className="w-full md:w-auto">Zahlungsmethode hinzufügen</Button>
    </div>
  );
};

export default PaymentTab;
