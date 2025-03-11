import { Menu, X, Stethoscope, Building, BookOpen, Users, FileText, Package, ShoppingBag } from "lucide-react";
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
  const { user, isAuthenticated, isDoctor, isPharmacy, logout } = useAuth();
  const cartCount = getCartCount();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { name: "Dokumentation", path: "/documentation", icon: <BookOpen className="h-4 w-4" /> },
    ];

    if (isDoctor) {
      return [
        { name: "Patientenverwaltung", path: "/doctor/dashboard", icon: <Users className="h-4 w-4" /> },
        { name: "Rezeptanfragen", path: "/doctor/dashboard", icon: <FileText className="h-4 w-4" /> },
        ...baseItems
      ];
    } else if (isPharmacy) {
      return [
        { name: "Produkte", path: "/pharmacy/management", icon: <Package className="h-4 w-4" /> },
        { name: "Bestellungen", path: "/pharmacy/management", icon: <ShoppingBag className="h-4 w-4" /> },
        ...baseItems
      ];
    }

    return [
      { name: "Shop", path: "/products", icon: <ShoppingBag className="h-4 w-4" /> },
      ...baseItems
    ];
  };

  const navItems = getNavItems();

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

        <DesktopNav navItems={navItems} />

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserMenu 
            user={user} 
            isAuthenticated={isAuthenticated} 
            isDoctor={isDoctor} 
            isPharmacy={isPharmacy} 
            onLogout={handleLogout} 
          />
          <CartButton cartCount={cartCount} />

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
