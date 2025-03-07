
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartItem from "./CartItem";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

const Cart: React.FC = () => {
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingCost = subtotal > 100 ? 0 : 4.99;
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/checkout");
    }, 800);
  };

  useEffect(() => {
    console.log("Cart items updated:", cartItems.length);
  }, [cartItems]);

  return (
    <div className="animate-fade-in">
      <div className="container px-4 mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            Warenkorb
          </h1>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Weiter Einkaufen
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  {...item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))
            ) : (
              <div className="text-center py-16 border border-dashed rounded-lg animate-fade-in">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">Dein Warenkorb ist leer</h3>
                <p className="text-muted-foreground mb-6">
                  Es sieht so aus, als hättest du noch keine Produkte zu deinem Warenkorb hinzugefügt.
                </p>
                <Button onClick={() => navigate("/")}>Produkte Entdecken</Button>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="border border-border rounded-lg p-6 bg-card sticky top-24 animate-slide-up">
                <h2 className="text-lg font-medium mb-4">Bestellübersicht</h2>
                
                <div className="space-y-3 border-b border-border pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Zwischensumme</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Versand</span>
                    {shippingCost === 0 ? (
                      <span className="text-primary font-medium">Kostenlos</span>
                    ) : (
                      <span>€{shippingCost.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {subtotal < 100 && (
                    <div className="text-xs text-muted-foreground bg-secondary rounded-md p-2 mt-2">
                      Füge weitere Produkte im Wert von €{(100 - subtotal).toFixed(2)} hinzu, um kostenlosen Versand zu erhalten
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between font-medium text-lg mb-6">
                  <span>Gesamtsumme</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                
                <Button
                  className="w-full transition-all duration-300"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  ) : (
                    <>
                      Zur Kasse
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Sicherer Checkout powered by Dr.Ansay
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
