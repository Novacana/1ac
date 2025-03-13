
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileViewToggle from "./MobileViewToggle";
import MobileThemeToggle from "./mobile/MobileThemeToggle";
import MobileSearch from "./mobile/MobileSearch";
import MobileUserButton from "./mobile/MobileUserButton";
import MobileCartButton from "./mobile/MobileCartButton";
import { useProductSuggestions } from "@/hooks/useProductSuggestions";

const MobileNavDots = () => {
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { isAuthenticated, isDoctor } = useAuth();
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
        <MobileThemeToggle />
      </div>
      
      {/* Search expanded view - only shows when search is active */}
      {showSearch && (
        <MobileSearch 
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          suggestions={suggestions}
          handleSearch={handleSearch}
        />
      )}
      
      <div className="flex gap-3">
        {/* Search button */}
        <MobileSearch 
          showSearch={false} 
          setShowSearch={setShowSearch}
          suggestions={suggestions}
          handleSearch={handleSearch}
        />
        
        {/* User button */}
        <MobileUserButton 
          isAuthenticated={isAuthenticated} 
          isDoctor={isDoctor}
          onClick={handleUserClick}
        />
        
        {/* Cart button */}
        <MobileCartButton cartCount={cartCount} />
      </div>
    </div>
  );
};

export default MobileNavDots;
