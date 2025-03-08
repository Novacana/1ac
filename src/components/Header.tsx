
import { ShoppingCart, Menu, X, User, Stethoscope, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

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

  const navItems = [
    { name: "Showroom", path: "/" },
    { name: "Shop", path: "/products" },
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

        <nav className="flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-foreground/80 hover:text-foreground font-medium transition-all duration-200",
                location.pathname === item.path && "text-primary font-semibold"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isDoctor ? (
                  <DropdownMenuItem onClick={() => navigate('/doctor/dashboard')}>
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Arzt Dashboard
                  </DropdownMenuItem>
                ) : isPharmacy ? (
                  <DropdownMenuItem onClick={() => navigate('/pharmacy/management')}>
                    <Building className="h-4 w-4 mr-2" />
                    Apotheken-Management
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Abmelden
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/login')}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Anmelden</span>
            </Button>
          )}

          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-background/10"
              aria-label="Warenkorb"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

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

      <div
        className={cn(
          "fixed inset-x-0 top-[var(--header-height)] h-screen bg-background/95 backdrop-blur-md md:hidden transition-transform duration-300 ease-in-out transform",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="container flex flex-col space-y-6 py-8 px-4 animate-fade-in">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "text-foreground/80 hover:text-foreground text-lg font-medium transition-all px-2 py-3 rounded-md",
                location.pathname === item.path
                  ? "text-primary font-semibold bg-primary/10"
                  : "hover:bg-background/10"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          
          {isAuthenticated && isPharmacy && (
            <Link
              to="/pharmacy/management"
              className={cn(
                "text-foreground/80 hover:text-foreground text-lg font-medium transition-all px-2 py-3 rounded-md",
                location.pathname === '/pharmacy/management'
                  ? "text-primary font-semibold bg-primary/10"
                  : "hover:bg-background/10"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              Apotheken-Management
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
