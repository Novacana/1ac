
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileViewToggle from "./MobileViewToggle";

const MobileNavDots = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { isAuthenticated, isDoctor, isPharmacy } = useAuth();
  const cartCount = getCartCount();
  
  const handleUserClick = () => {
    if (isDoctor) {
      navigate('/doctor/dashboard');
    } else if (isPharmacy) {
      navigate('/pharmacy/management');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="fixed z-50 top-3 w-full px-4 flex justify-between md:hidden animate-fade-in">
      {/* View toggle dot */}
      <MobileViewToggle />
      
      <div className="flex gap-3">
        {/* User dot - only show when authenticated */}
        {isAuthenticated && (
          <button
            onClick={handleUserClick}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
              (location.pathname === '/dashboard' || 
               location.pathname === '/doctor/dashboard' || 
               location.pathname === '/pharmacy/management')
                ? "bg-primary text-white"
                : "bg-background/70 text-foreground shadow-sm"
            )}
            aria-label="Zum Benutzerkonto"
          >
            <User size={20} />
          </button>
        )}
        
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
    </div>
  );
};

export default MobileNavDots;
