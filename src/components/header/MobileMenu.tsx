
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
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
      <nav className="container flex flex-col py-4 px-2 animate-fade-in">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "text-foreground/80 hover:text-foreground font-medium transition-all px-2 py-2 rounded-md flex items-center gap-2",
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
              "text-foreground/80 hover:text-foreground font-medium transition-all px-2 py-2 rounded-md",
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
  );
};

export default MobileMenu;
