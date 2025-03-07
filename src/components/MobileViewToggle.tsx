
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Grid } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileViewToggle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  if (!isMobile) return null;
  
  const isShop = location.pathname === "/products" || location.pathname.startsWith("/product/");
  const isShowroom = location.pathname === "/";
  
  const toggleView = () => {
    if (isShop) {
      navigate("/");
    } else {
      navigate("/products");
    }
  };
  
  return (
    <button
      onClick={toggleView}
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
        isShop || isShowroom
          ? "bg-primary text-white"
          : "bg-background/70 text-foreground shadow-sm"
      )}
      aria-label={isShop ? "Zur Showroom-Ansicht wechseln" : "Zur Shop-Ansicht wechseln"}
    >
      <Grid size={20} />
    </button>
  );
};

export default MobileViewToggle;
