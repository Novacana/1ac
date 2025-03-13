
import { Menu, X, ShoppingBag, Home, GraduationCap } from "lucide-react";
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

  // If mobile, don't render the header at all
  if (isMobile) return null;

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

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--header-height", 
      isMobile ? "60px" : "80px"
    );
    
    return () => {
      document.documentElement.style.removeProperty("--header-height");
    };
  }, [isMobile]);

  const getNavItems = (): NavItem[] => {
    // Base items always shown to all users
    const baseItems: NavItem[] = [
      { name: "School", path: "/", icon: <GraduationCap className="h-4 w-4" /> },
      { name: "Sorten", path: "/products", icon: <ShoppingBag className="h-4 w-4" /> },
    ];

    return baseItems;
  };

  const navItems = getNavItems();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-md",
        isScrolled
          ? "py-3 bg-background/70 shadow-sm"
          : "py-5 bg-transparent",
        "animate-fade-in"
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

        <div className="flex-1 flex justify-center">
          <DesktopNav navItems={navItems} />
        </div>

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
