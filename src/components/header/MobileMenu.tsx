
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NavItem } from "./types";

interface MobileMenuProps {
  navItems: NavItem[];
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  isAuthenticated: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  navItems,
  isMenuOpen,
  setIsMenuOpen,
  isAuthenticated,
}) => {
  const location = useLocation();

  return (
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
              "text-foreground/80 hover:text-foreground text-lg font-medium transition-all px-2 py-3 rounded-md flex items-center gap-3",
              location.pathname === item.path
                ? "text-primary font-semibold bg-primary/10"
                : "hover:bg-background/10"
            )}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
        
        {isAuthenticated && (
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
        
        <div className="px-2 py-3 flex items-center justify-between">
          <span className="text-foreground/80 text-lg font-medium">
            Dunkles Design
          </span>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;
