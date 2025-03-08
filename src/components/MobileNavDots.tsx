import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import MobileViewToggle from "./MobileViewToggle";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileNavDots = () => {
  const location = useLocation();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  const isMobile = useIsMobile();
  
  // Only render on mobile devices
  if (!isMobile) return null;
  
  return (
    <div className="fixed z-50 top-3 w-full px-4 flex justify-between md:hidden animate-fade-in">
      {/* View toggle dot */}
      <MobileViewToggle />
      
      {/* Cart dot - we'll keep this hidden since we now have the cart in the header
         but keep the component in case we want to show it again later */}
      <div className="opacity-0 pointer-events-none">
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
    </div>
  );
};

export default MobileNavDots;
