
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

// Import individual FAQ item components
import AccountSecurityItem from "./faq/AccountSecurityItem";
import BrowserSupportItem from "./faq/BrowserSupportItem";
import PharmacySoftwareItem from "./faq/PharmacySoftwareItem";
import EPrescriptionItem from "./faq/EPrescriptionItem";
import DataProtectionItem from "./faq/DataProtectionItem";
import PatientDataImportItem from "./faq/PatientDataImportItem";
import VideoConsultationItem from "./faq/VideoConsultationItem";
import PatientDocumentsItem from "./faq/PatientDocumentsItem";

const FaqTabContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Häufig gestellte Fragen
        </CardTitle>
        <CardDescription>
          Antworten auf die häufigsten Fragen zur Nutzung der Plattform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="single" collapsible className="w-full">
            <AccountSecurityItem />
            <BrowserSupportItem />
            <PharmacySoftwareItem />
            <EPrescriptionItem />
            <DataProtectionItem />
            <PatientDataImportItem />
            <VideoConsultationItem />
            <PatientDocumentsItem />
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FaqTabContent;
