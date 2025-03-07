
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  noHeader?: boolean;
  className?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  noHeader = false,
  className,
}) => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!noHeader && <Header />}
      <main
        className={cn(
          "flex-1 pt-24 pb-16 animate-fade-in",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
