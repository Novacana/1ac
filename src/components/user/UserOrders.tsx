
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for demonstration
const mockOrders = [
  {
    id: "ORD-12345",
    date: "2023-05-15",
    status: "completed",
    total: 79.95,
    items: 3
  },
  {
    id: "ORD-12346",
    date: "2023-06-20",
    status: "processing",
    total: 49.50,
    items: 2
  },
  {
    id: "ORD-12347",
    date: "2023-07-05",
    status: "delivered",
    total: 129.99,
    items: 5
  }
];

// Status badge color mapping
const statusColorMap = {
  processing: "bg-blue-500",
  delivered: "bg-green-500",
  completed: "bg-green-700",
  cancelled: "bg-red-500"
};

// Status text mapping
const statusTextMap = {
  processing: "In Bearbeitung",
  delivered: "Geliefert",
  completed: "Abgeschlossen",
  cancelled: "Storniert"
};

const UserOrders: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meine Bestellungen</CardTitle>
      </CardHeader>
      <CardContent>
        {mockOrders.length > 0 ? (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="border rounded-md p-4 hover:bg-accent/50 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{order.id}</h3>
                      <Badge className={statusColorMap[order.status as keyof typeof statusColorMap]}>
                        {statusTextMap[order.status as keyof typeof statusTextMap]}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.date).toLocaleDateString("de-DE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </p>
                    <p className="text-sm mt-1">
                      {order.items} {order.items === 1 ? "Artikel" : "Artikel"} • €{order.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      Rechnung
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground mb-4">Sie haben noch keine Bestellungen aufgegeben.</p>
            <Button>Jetzt einkaufen</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserOrders;
