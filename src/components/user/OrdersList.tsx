
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, FileText, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock order data
const mockOrders = [
  {
    id: 'ORD-9385',
    date: '15. Juli 2023',
    status: 'completed',
    total: '79,90 €',
    items: [
      { name: 'CBD Öl 5%', quantity: 1, price: '39,95 €' },
      { name: 'Hanf Tee', quantity: 2, price: '19,95 €' }
    ]
  },
  {
    id: 'ORD-8254',
    date: '2. Juni 2023',
    status: 'processing',
    total: '59,90 €',
    items: [
      { name: 'CBD Kapseln', quantity: 1, price: '29,95 €' },
      { name: 'Hanf Balm', quantity: 1, price: '29,95 €' }
    ]
  },
  {
    id: 'ORD-7125',
    date: '18. Mai 2023',
    status: 'completed',
    total: '89,85 €',
    items: [
      { name: 'CBD Öl 10%', quantity: 1, price: '59,90 €' },
      { name: 'Hanf Protein', quantity: 1, price: '29,95 €' }
    ]
  }
];

// Status badge mapping
const getStatusBadge = (status) => {
  switch (status) {
    case 'completed':
      return <Badge className="bg-green-500 hover:bg-green-600">Abgeschlossen</Badge>;
    case 'processing':
      return <Badge className="bg-blue-500 hover:bg-blue-600">In Bearbeitung</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500 hover:bg-red-600">Storniert</Badge>;
    default:
      return <Badge>Unbekannt</Badge>;
  }
};

const OrdersList = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meine Bestellungen</h2>
      </div>
      
      {mockOrders.length > 0 ? (
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="py-4 px-6 bg-muted/30 border-b">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-medium">{order.id}</CardTitle>
                    <CardDescription>Bestellt am {order.date}</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="font-semibold">{order.total}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Artikel</h4>
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span>{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Rechnung
                    </Button>
                    {order.status === 'processing' && (
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Sendung verfolgen
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <div className="py-10 space-y-4">
            <div className="flex justify-center">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Keine Bestellungen gefunden</h3>
            <p className="text-muted-foreground">
              Sie haben noch keine Bestellungen getätigt.
            </p>
            <Button asChild>
              <Link to="/products">Jetzt einkaufen</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OrdersList;
