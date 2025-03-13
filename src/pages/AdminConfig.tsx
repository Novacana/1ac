
import React, { useState } from "react";
import Layout from "@/components/Layout";
import PartnerConfig from "@/components/admin/PartnerConfig";
import PaymentConfig from "@/components/admin/PaymentConfig";
import CentralAdminConfig from "@/components/admin/CentralAdminConfig";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Users, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";

type AdminSection = "central" | "partners" | "payments";

const AdminConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminSection>("partners");
  const isMobile = useIsMobile();

  const getTabTitle = () => {
    switch (activeTab) {
      case "central": return "Zentrale Verwaltung";
      case "partners": return "Partner";
      case "payments": return "Zahlungen";
      default: return "Shop-Konfiguration";
    }
  };

  return (
    <Layout>
      <TooltipProvider>
        <div className={`mx-auto ${isMobile ? 'px-0 py-0 pb-24' : 'container px-4 py-6'}`}>
          {!isMobile && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <Link to="/">
                  <Button variant="outline" size="sm" className="mb-4">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Zurück zum Shop
                  </Button>
                </Link>
                <h1 className="text-3xl font-bold">Shop-Konfiguration</h1>
                <p className="text-muted-foreground mt-2">
                  Konfigurieren Sie Ihre Shop-Integrationen, Partner und Zahlungseinstellungen.
                </p>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab as (value: string) => void} className="mt-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="central">Zentrale Verwaltung</TabsTrigger>
                  <TabsTrigger value="partners">Partner</TabsTrigger>
                  <TabsTrigger value="payments">Zahlungen</TabsTrigger>
                </TabsList>
                
                <TabsContent value="central">
                  <CentralAdminConfig />
                </TabsContent>

                <TabsContent value="partners">
                  <PartnerConfig />
                </TabsContent>

                <TabsContent value="payments">
                  <PaymentConfig />
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {isMobile && (
            <div className="flex flex-col min-h-screen">
              <div className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                <h1 className="text-xl font-bold">{getTabTitle()}</h1>
              </div>
              
              <div className="flex-1 px-4 pb-20">
                {activeTab === "central" && <CentralAdminConfig />}
                {activeTab === "partners" && <PartnerConfig />}
                {activeTab === "payments" && <PaymentConfig />}
              </div>
              
              <MobileNavigation 
                activeSection={activeTab}
                onSectionChange={setActiveTab}
              />
            </div>
          )}
        </div>
      </TooltipProvider>
    </Layout>
  );
};

interface MobileNavigationProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
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
      <div className="grid grid-cols-3 gap-1 p-2">
        <MobileNavigationItem
          icon={<Settings className="h-5 w-5" />}
          label="Zentral"
          active={activeSection === 'central'}
          onClick={() => onSectionChange('central')}
        />
        <MobileNavigationItem
          icon={<Users className="h-5 w-5" />}
          label="Partner"
          active={activeSection === 'partners'}
          onClick={() => onSectionChange('partners')}
        />
        <MobileNavigationItem
          icon={<CreditCard className="h-5 w-5" />}
          label="Zahlungen"
          active={activeSection === 'payments'}
          onClick={() => onSectionChange('payments')}
        />
      </div>
    </div>
  );
};

export default AdminConfig;
