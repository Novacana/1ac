
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import MobileNavDots from "./MobileNavDots";
import ProductAdvisor from "./AdvisorBot";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  noHeader?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  noHeader = false,
  className,
  fullWidth = true, // Default to full width
}) => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <ThemeProvider defaultTheme="light" storageKey="cannabis-shop-theme">
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {!noHeader && <Header />}
        <MobileNavDots />
        <main
          className={cn(
            "flex-1 md:pt-24 pt-16 pb-16 animate-fade-in w-full",
            className
          )}
        >
          {children}
        </main>
        <ProductAdvisor />
      </div>
    </ThemeProvider>
  );
};

export default Layout;
