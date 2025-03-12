import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import MobileNavDots from "./MobileNavDots";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import N8nChatBot from "./N8nChatBot";

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
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const savedTheme = (localStorage.getItem("cannabis-shop-theme") as "light" | "dark" | "system") || "light";

  return (
    <ThemeProvider defaultTheme={savedTheme} storageKey="cannabis-shop-theme">
      <div className="min-h-screen flex flex-col bg-background text-foreground relative">
        <div className="dark:block hidden pointer-events-none">
          <div className="fixed top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>
          <div className="fixed bottom-1/4 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-20 -z-10"></div>
          <div className="fixed top-1/3 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-2xl opacity-10 -z-10"></div>
        </div>
        
        {!noHeader && <Header />}
        <MobileNavDots />
        <main
          className={cn(
            "flex-1 md:pt-24 pt-16 pb-16 animate-fade-in w-full max-w-none px-0",
            className
          )}
        >
          {children}
        </main>
        {!noAdvisor && <N8nChatBot />}
      </div>
    </ThemeProvider>
  );
};

export default Layout;
