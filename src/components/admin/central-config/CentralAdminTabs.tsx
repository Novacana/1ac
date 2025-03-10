
import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Settings, BarChart3, ShieldCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CentralAdminFormValues } from "./types";
import GeneralTab from "./GeneralTab";
import PlatformTab from "./PlatformTab";
import GdprTab from "./GdprTab";

interface CentralAdminTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  form: UseFormReturn<CentralAdminFormValues>;
}

const CentralAdminTabs: React.FC<CentralAdminTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  form 
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 grid grid-cols-3">
        <TabsTrigger value="general" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Allgemein</span>
        </TabsTrigger>
        <TabsTrigger value="platform" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Plattform</span>
        </TabsTrigger>
        <TabsTrigger value="gdpr" className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span className="hidden sm:inline">DSGVO</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <GeneralTab form={form} />
      </TabsContent>

      <TabsContent value="platform" className="space-y-4">
        <PlatformTab form={form} />
      </TabsContent>

      <TabsContent value="gdpr" className="space-y-4">
        <GdprTab form={form} />
      </TabsContent>
    </Tabs>
  );
};

export default CentralAdminTabs;
