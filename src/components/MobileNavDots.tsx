
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Moon, Sun, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import MobileViewToggle from "./MobileViewToggle";
import { Input } from "@/components/ui/input";

const MobileNavDots = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { isAuthenticated, isDoctor } = useAuth();
  const { theme, setTheme } = useTheme();
  const cartCount = getCartCount();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleUserClick = () => {
    if (isDoctor) {
      navigate('/doctor/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  return (
    <div className="fixed z-50 top-3 w-full px-4 flex justify-between md:hidden animate-fade-in">
      {/* View toggle dot and Theme toggle dot */}
      <div className="flex gap-3">
        <MobileViewToggle />
        
        <button
          onClick={toggleTheme}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
            "bg-background/70 text-foreground shadow-sm"
          )}
          aria-label={theme === "dark" ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
        >
          {theme === "dark" ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>
      </div>
      
      {/* Search expanded view - only shows when search is active */}
      {showSearch && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-md">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Suche nach Sorte..."
                className="w-full h-12 pl-4 pr-12 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                type="submit" 
                className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Search size={20} />
              </button>
              <button 
                type="button" 
                onClick={() => setShowSearch(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        </div>
      )}
      
      <div className="flex gap-3">
        {/* Search dot */}
        <button
          onClick={() => setShowSearch(true)}
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
            "bg-background/70 text-foreground shadow-sm"
          )}
          aria-label="Produkte suchen"
        >
          <Search size={20} />
        </button>
        
        {/* User dot - only show when authenticated */}
        {isAuthenticated && (
          <button
            onClick={handleUserClick}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
              location.pathname === '/dashboard' || location.pathname === '/doctor/dashboard'
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
