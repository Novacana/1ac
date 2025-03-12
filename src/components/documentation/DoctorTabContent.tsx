
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User } from "lucide-react";

// Import individual doctor accordion item components
import PatientManagementItem from "./doctor/PatientManagementItem";
import PrescriptionManagementItem from "./doctor/PrescriptionManagementItem";
import TelemedicineItem from "./doctor/TelemedicineItem";
import DataPrivacyItem from "./doctor/DataPrivacyItem";

const DoctorTabContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Arzt-Dashboard
        </CardTitle>
        <CardDescription>
          Anleitung zur Nutzung des Arzt-Dashboards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="single" collapsible className="w-full">
            <PatientManagementItem />
            <PrescriptionManagementItem />
            <TelemedicineItem />
            <DataPrivacyItem />
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DoctorTabContent;
