
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import UserSidebar from '@/components/user/UserSidebar';
import OrdersList from '@/components/user/OrdersList';
import ConsultationsList from '@/components/user/ConsultationsList';
import WishlistItems from '@/components/user/WishlistItems';
import UserSettings from '@/components/user/UserSettings';
import { ChevronRight, Home, ShoppingBag, VideoIcon, Heart, Settings } from 'lucide-react';
import { TooltipProvider } from '@/components/ui/tooltip';

type UserSection = 'orders' | 'consultations' | 'wishlist' | 'settings';

const UserDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<UserSection>('orders');
  
  // Update activeSection based on current location
  useEffect(() => {
    if (location.pathname.includes('/dashboard/consultations')) {
      setActiveSection('consultations');
    } else if (location.pathname.includes('/dashboard/wishlist')) {
      setActiveSection('wishlist');
    } else if (location.pathname.includes('/dashboard/settings')) {
      setActiveSection('settings');
    } else {
      setActiveSection('orders');
    }
  }, [location.pathname]);

  // Helper function to get the current page title
  const getPageTitle = () => {
    if (location.pathname.includes('/dashboard/consultations')) return 'Beratungen';
    if (location.pathname.includes('/dashboard/wishlist')) return 'Wunschliste';
    if (location.pathname.includes('/dashboard/settings')) return isMobile ? '' : 'Einstellungen';
    return 'Bestellungen';
  };

  const handleSectionChange = (section: UserSection) => {
    setActiveSection(section);
    navigate(`/dashboard${section === 'orders' ? '' : `/${section}`}`);
  };

  // Render the appropriate component based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'consultations':
        return <ConsultationsList />;
      case 'wishlist':
        return <WishlistItems />;
      case 'settings':
        return <UserSettings />;
      case 'orders':
      default:
        return <OrdersList />;
    }
  };

  return (
    <Layout>
      <TooltipProvider>
        <div className={`mx-auto ${isMobile ? 'px-0 py-0 pb-24' : 'container px-4 py-6'}`}>
          {!isMobile && (
            <>
              {/* Breadcrumb for desktop */}
              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <Link to="/" className="hover:underline flex items-center">
                  <Home className="h-3.5 w-3.5 mr-1" />
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5 mx-1" />
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                {location.pathname !== '/dashboard' && (
                  <>
                    <ChevronRight className="h-3.5 w-3.5 mx-1" />
                    <span className="text-foreground">{getPageTitle()}</span>
                  </>
                )}
              </div>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="md:w-1/4">
                  <UserSidebar user={user} />
                </div>
                
                {/* Main content */}
                <div className="md:w-3/4">
                  {renderContent()}
                </div>
              </div>
            </>
          )}
          
          {isMobile && (
            <div className="flex flex-col min-h-screen">
              <div className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                {getPageTitle() && <h1 className="text-xl font-bold">{getPageTitle()}</h1>}
              </div>
              
              <div className="flex-1 px-4 pb-20">
                {renderContent()}
              </div>
              
              <MobileNavigation 
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
              />
            </div>
          )}
        </div>
      </TooltipProvider>
    </Layout>
  );
};

interface MobileNavigationProps {
  activeSection: UserSection;
  onSectionChange: (section: UserSection) => void;
}

const MobileNavigationItem = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-1 w-full p-2 rounded-md
      ${active ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-background/80"}`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeSection, onSectionChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t border-border md:hidden">
      <div className="grid grid-cols-4 gap-1 p-2">
        <MobileNavigationItem
          icon={<ShoppingBag className="h-5 w-5" />}
          label="Bestellungen"
          active={activeSection === 'orders'}
          onClick={() => onSectionChange('orders')}
        />
        <MobileNavigationItem
          icon={<VideoIcon className="h-5 w-5" />}
          label="Beratungen"
          active={activeSection === 'consultations'}
          onClick={() => onSectionChange('consultations')}
        />
        <MobileNavigationItem
          icon={<Heart className="h-5 w-5" />}
          label="Wunschliste"
          active={activeSection === 'wishlist'}
          onClick={() => onSectionChange('wishlist')}
        />
        <MobileNavigationItem
          icon={<Settings className="h-5 w-5" />}
          label="Einstellungen"
          active={activeSection === 'settings'}
          onClick={() => onSectionChange('settings')}
        />
      </div>
    </div>
  );
};

export default UserDashboard;
