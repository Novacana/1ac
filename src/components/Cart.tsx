
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
          <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <ShoppingCart className="h-6 w-6" />
            Shopping Cart
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="text-sm bg-background text-foreground hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
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
              <div className="text-center py-16 border border-dashed rounded-lg animate-fade-in bg-card shadow-sm">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Button 
                  onClick={() => navigate("/")}
                  className="bg-primary hover:bg-primary/90"
                >
                  Browse Products
                </Button>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <div className="border border-border rounded-lg p-6 bg-card shadow-sm sticky top-24 animate-slide-up">
                <h2 className="text-lg font-medium mb-4 text-foreground">Order Summary</h2>
                
                <div className="space-y-3 border-b border-border pb-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    {shippingCost === 0 ? (
                      <span className="text-primary font-medium">Free</span>
                    ) : (
                      <span className="font-medium">€{shippingCost.toFixed(2)}</span>
                    )}
                  </div>
                  
                  {subtotal < 100 && (
                    <div className="text-xs text-muted-foreground bg-secondary/70 rounded-md p-2 mt-2">
                      Add €{(100 - subtotal).toFixed(2)} more to qualify for free shipping
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between font-medium text-lg mb-6 text-foreground">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                
                <Button
                  className="w-full transition-all duration-300 bg-primary hover:bg-primary/90 text-white"
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure checkout powered by Dr.Ansay
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
