
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import MobileNavDots from "./MobileNavDots";
import ProductAdvisor from "./AdvisorBot";
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
      <MobileNavDots />
      <main
        className={cn(
          "flex-1 md:pt-28 md:px-8 pt-16 pb-16 animate-fade-in max-w-7xl mx-auto w-full",
          className
        )}
      >
        {children}
      </main>
      <ProductAdvisor />
    </div>
  );
};

export default Layout;
