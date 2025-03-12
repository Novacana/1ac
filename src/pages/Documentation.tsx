
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DoctorTabContent from "@/components/documentation/DoctorTabContent";
import PharmacistTabContent from "@/components/documentation/PharmacistTabContent";
import GdprTabContent from "@/components/documentation/GdprTabContent";
import FaqTabContent from "@/components/documentation/FaqTabContent";

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("doctors");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Dokumentation</h1>
          <p className="text-muted-foreground mb-8">
            Umfassende Anleitung für Ärzte und Apotheker zur Nutzung der Plattform
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="doctors">Für Ärzte</TabsTrigger>
              <TabsTrigger value="pharmacists">Für Apotheker</TabsTrigger>
              <TabsTrigger value="gdpr">DSGVO-Konformität</TabsTrigger>
              <TabsTrigger value="faq">Häufige Fragen</TabsTrigger>
            </TabsList>

            <TabsContent value="doctors" className="space-y-6">
              <DoctorTabContent />
            </TabsContent>

            <TabsContent value="pharmacists" className="space-y-6">
              <PharmacistTabContent />
            </TabsContent>

            <TabsContent value="gdpr" className="space-y-6">
              <GdprTabContent />
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <FaqTabContent />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
