
import Header from "./Header";
import Footer from "./Footer";
import MobileNavDots from "./MobileNavDots";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  noFooter?: boolean;
  noHeader?: boolean;
}

const Layout = ({ children, fullWidth = false, noFooter = false, noHeader = false }: LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      {!noHeader && <Header />}
      
      {/* Mobile navigation dots */}
      {isMobile && <MobileNavDots />}
      
      <main className={`flex-1 ${!fullWidth ? "container mx-auto" : ""} pt-[calc(var(--header-height)+1rem)]`}>
        {children}
      </main>
      
      {!noFooter && <Footer />}
    </div>
  );
};

export default Layout;
