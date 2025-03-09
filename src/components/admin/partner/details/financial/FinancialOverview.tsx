
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Partner } from "../../../PartnerConfig";

interface FinancialOverviewProps {
  partner: Partner;
  onChange: (updatedPartner: Partner) => void;
  totalCommission: number;
  totalPaid: number;
  balance: number;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ 
  partner, 
  onChange, 
  totalCommission, 
  totalPaid, 
  balance 
}) => {
  return (
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
  );
};

export default FinancialOverview;
