
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatisticsTabProps {
  statistics: {
    prescriptionsCount: number;
    patientsCount: number;
    consultationsCount: number;
    totalRevenue: number;
  };
}

const StatisticsTab: React.FC<StatisticsTabProps> = ({ statistics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold">{statistics.prescriptionsCount}</h3>
              <p className="text-sm text-muted-foreground mt-1">Rezepte insgesamt</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold">{statistics.patientsCount}</h3>
              <p className="text-sm text-muted-foreground mt-1">Patienten</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold">€{statistics.totalRevenue.toFixed(2)}</h3>
              <p className="text-sm text-muted-foreground mt-1">Gesamtumsatz</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-muted/30 p-6 rounded-lg border h-64 flex items-center justify-center">
        <p className="text-muted-foreground">Statistik-Diagramme werden hier angezeigt</p>
      </div>
    </div>
  );
};

export default StatisticsTab;
