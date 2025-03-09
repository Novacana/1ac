
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";

const ActivityTab: React.FC = () => {
  return (
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
  );
};

export default ActivityTab;
