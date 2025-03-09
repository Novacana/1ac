
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import DesktopNav from "./header/DesktopNav";
import UserMenu from "./header/UserMenu";
import CartButton from "./header/CartButton";
import MobileMenu from "./header/MobileMenu";
import { NavItem } from "./header/types";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { user, isAuthenticated, isDoctor, logout } = useAuth();
  const cartCount = getCartCount();
  const isMobile = useIsMobile();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems: NavItem[] = [
    { name: "Showroom", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "Dokumentation", path: "/documentation" },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md",
        isScrolled
          ? "py-3 bg-background/70 shadow-sm"
          : "py-5 bg-transparent",
        "animate-fade-in",
        isMobile ? "hidden" : "block"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center transition-all duration-300 hover:opacity-80"
        >
          <img 
            src="/lovable-uploads/0b90ddd4-3b5f-4f64-8e87-5f7f9af7e0a3.png" 
            alt="1A Cannabis Logo" 
            className="h-16 w-auto" 
            onError={(e) => {
              console.error("Logo loading error");
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </Link>

        {/* Desktop Navigation */}
        <DesktopNav navItems={navItems} />

        {/* Action Buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserMenu 
            user={user} 
            isAuthenticated={isAuthenticated} 
            isDoctor={isDoctor} 
            onLogout={handleLogout} 
          />
          <CartButton cartCount={cartCount} />

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden hover:bg-background/10"
            aria-label={isMenuOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        navItems={navItems}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
};

export default Header;
