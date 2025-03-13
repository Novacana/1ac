
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NavItem } from "./types";

interface DesktopNavProps {
  navItems: NavItem[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ navItems }) => {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center space-x-8 justify-center">
      {navItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={cn(
            "text-foreground/80 hover:text-foreground font-medium transition-all duration-200 flex items-center gap-2",
            location.pathname === item.path && "text-primary font-semibold"
          )}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}
    </nav>
  );
};

export default DesktopNav;
