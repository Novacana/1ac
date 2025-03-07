
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Grid } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

const MobileNavDots = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  
  return (
    <div className="fixed z-50 top-3 w-full px-4 flex justify-between md:hidden animate-fade-in">
      {/* Products dot */}
      <Link 
        to="/products" 
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
          location.pathname.includes('/product') || location.pathname === '/products'
            ? "bg-primary text-white"
            : "bg-background/70 text-foreground shadow-sm"
        )}
        aria-label="Alle Produkte anzeigen"
      >
        <Grid size={20} />
      </Link>
      
      {/* Cart dot */}
      <Link 
        to="/cart" 
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
          location.pathname === '/cart'
            ? "bg-primary text-white"
            : "bg-background/70 text-foreground shadow-sm"
        )}
        aria-label="Warenkorb anzeigen"
      >
        <div className="relative">
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default MobileNavDots;
