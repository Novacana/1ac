
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileCartButtonProps {
  cartCount: number;
}

const MobileCartButton: React.FC<MobileCartButtonProps> = ({ cartCount }) => {
  const location = useLocation();
  
  return (
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
  );
};

export default MobileCartButton;
