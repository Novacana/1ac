
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import CartItem from './CartItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, ArrowRight, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';

const Cart = () => {
  const { cartItems, removeItem, updateQuantity } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Calculate total from cartItems
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isEmpty = cartItems.length === 0;

  return (
    <div className={`mx-auto ${isMobile ? 'px-4 py-4' : 'container px-4 py-8'}`}>
      {isMobile && (
        <h1 className="text-xl font-bold mb-4">Warenkorb</h1>
      )}
      
      {!isMobile && (
        <h1 className="text-3xl font-bold mb-6">Warenkorb</h1>
      )}
      
      {isEmpty ? (
        <Card className={`${isMobile ? 'mt-2' : 'mt-6'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Ihr Warenkorb ist leer
            </CardTitle>
            <CardDescription>
              Fügen Sie Produkte zu Ihrem Warenkorb hinzu, um eine Bestellung aufzugeben.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => navigate('/products')} className="w-full sm:w-auto">
              Produkte entdecken
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-3 gap-6'}`}>
          <div className={`${isMobile ? 'col-span-1' : 'md:col-span-2'}`}>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  image={item.image}
                  quantity={item.quantity}
                  onUpdateQuantity={(id, quantity) => updateQuantity(id, quantity)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>
          </div>
          
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Zusammenfassung</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Zwischensumme</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Versand</span>
                    <span>0.00 €</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-medium">
                    <span>Gesamtsumme</span>
                    <span>{total.toFixed(2)} €</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button 
                  onClick={() => navigate('/checkout')} 
                  className="w-full"
                >
                  Zur Kasse
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <Alert variant="default" className="bg-muted/50 border">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Hinweis</AlertTitle>
                  <AlertDescription className="text-xs">
                    Verschreibungspflichtige Produkte benötigen ein gültiges Rezept, das Sie im nächsten Schritt angeben können.
                  </AlertDescription>
                </Alert>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
