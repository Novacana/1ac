
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
  noAdvisor?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  noHeader = false,
  className,
  fullWidth = true,
  noAdvisor = false,
}) => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Determine if we're on the documentation page
  const isDocumentation = location.pathname === "/documentation";

  // Get stored theme preference or use default, ensuring it's a valid Theme type
  const savedTheme = (localStorage.getItem("cannabis-shop-theme") as "light" | "dark" | "system") || "light";

  return (
    <ThemeProvider defaultTheme={savedTheme} storageKey="cannabis-shop-theme">
      <div className="min-h-screen flex flex-col bg-background text-foreground relative">
        {/* Dark mode decoration elements - with improved visibility */}
        <div className="dark:block hidden pointer-events-none">
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>
          <div className="fixed bottom-1/4 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl opacity-30 -z-10"></div>
          <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-secondary/15 rounded-full blur-2xl opacity-20 -z-10"></div>
        </div>
        
        {/* Light mode decoration elements - for better contrast */}
        <div className="dark:hidden block pointer-events-none">
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30 -z-10"></div>
          <div className="fixed bottom-1/4 right-0 w-80 h-80 bg-slate-100 rounded-full blur-3xl opacity-40 -z-10"></div>
        </div>
        
        {!noHeader && <Header />}
        <MobileNavDots />
        <main
          className={cn(
            "flex-1 md:pt-24 pt-16 pb-16 animate-fade-in w-full border-t border-border/10",
            className
          )}
        >
          <div className="container mx-auto px-4 py-4">
            {children}
          </div>
        </main>
        {!noAdvisor && !isDocumentation && <ProductAdvisor />}
      </div>
    </ThemeProvider>
  );
};

export default Layout;
