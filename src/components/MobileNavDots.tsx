
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Moon, Sun, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import MobileViewToggle from "./MobileViewToggle";
import SearchAutocomplete from "./SearchAutocomplete";
import { useProductSuggestions } from "@/hooks/useProductSuggestions";

const MobileNavDots = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { isAuthenticated, isDoctor } = useAuth();
  const { theme, setTheme } = useTheme();
  const cartCount = getCartCount();
  const [showSearch, setShowSearch] = useState(false);
  const { suggestions } = useProductSuggestions();
  
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

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowSearch(false);
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
            <SearchAutocomplete
              suggestions={suggestions}
              onSearch={handleSearch}
              placeholder="Suche nach Sorte..."
              fullWidth
              autoFocus
              maxSuggestions={8}
              compact={true}
            />
            <button 
              type="button" 
              onClick={() => setShowSearch(false)}
              className="absolute right-4 top-4 p-2 rounded-full bg-background/70 text-foreground shadow-sm"
            >
              <X size={20} />
            </button>
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
