
import React from 'react';
import { PrescriptionCartItem } from '@/types/prescription';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ShoppingCart } from 'lucide-react';

interface CartItemsTabProps {
  cartItems?: PrescriptionCartItem[];
}

const CartItemsTab: React.FC<CartItemsTabProps> = ({ cartItems }) => {
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="p-6 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">
          Keine Produkte im Warenkorb vorhanden
        </p>
      </div>
    );
  }

  const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <div className="font-medium text-lg">Warenkorb des Patienten</div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Bild</TableHead>
              <TableHead>Produkt</TableHead>
              <TableHead className="text-right">Menge</TableHead>
              <TableHead className="text-right">Preis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="h-14 w-14 rounded-md overflow-hidden border">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">€{(item.price * item.quantity).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-medium">Gesamtsumme</TableCell>
              <TableCell className="text-right font-medium">€{totalPrice.toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CartItemsTab;
