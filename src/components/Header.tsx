
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  showUserLink?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showUserLink = false }) => {
  const { getCartCount } = useCart();
  const { isAuthenticated, isDoctor, user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const cartCount = getCartCount();

  const navigateToDashboard = () => {
    if (isDoctor) {
      navigate('/doctor/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md z-30 border-b border-border/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl flex gap-2 items-center">
          <span className="hidden sm:block">SmartCare</span>
          <span className="sm:hidden">SC</span>
        </Link>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={navigateToDashboard}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block">
                {user?.name}
              </span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={navigateToLogin}
              className="flex items-center gap-1"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:block">Login</span>
            </Button>
          )}

          {/* Only show cart button on non-mobile screens */}
          {!isMobile && (
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
