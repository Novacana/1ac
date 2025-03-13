
import React from "react";
import { SaveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import PersonalInfoTab from "./PersonalInfoTab";
import PaymentTab from "./PaymentTab";
import StatisticsTab from "./StatisticsTab";
import ScheduleTab from "./ScheduleTab";
import DocumentsTab from "./DocumentsTab";
import { User } from "lucide-react";

interface ProfileContentProps {
  activeTab: string;
  hasUnsavedChanges: boolean;
  loading: boolean;
  handleSaveProfile: () => Promise<void>;
  personalInfo: {
    name: string;
    specialty: string;
    email: string;
    phone: string;
  };
  licenseInfo: {
    licenseNumber: string;
    issuingAuthority: string;
    issueDate: string;
    expiryDate: string;
    specialty: string;
  };
  statistics: {
    patientsCount: number;
    prescriptionsCount: number;
    consultationsCount: number;
    totalRevenue: number;
  };
  handleInputChange: (field: string, value: string) => void;
  handleLicenseChange: (field: string, value: string) => void;
  setHasUnsavedChanges: (value: boolean) => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  activeTab,
  hasUnsavedChanges,
  loading,
  handleSaveProfile,
  personalInfo,
  licenseInfo,
  statistics,
  handleInputChange,
  handleLicenseChange,
  setHasUnsavedChanges
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case "personal": return "Persönliche Daten";
      case "payment": return "Zahlungsinformationen";
      case "statistics": return "Statistiken";
      case "schedule": return "Sprechzeiten";
      case "documents": return "Dokumente";
      default: return "Persönliche Daten";
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case "personal": return "Verwalten Sie Ihre persönlichen Informationen";
      case "payment": return "Verwalten Sie Ihre Zahlungsmethoden und Abrechnungen";
      case "statistics": return "Einsicht in Ihre Praxisstatistiken";
      case "schedule": return "Legen Sie Ihre Verfügbarkeit und Sprechzeiten fest";
      case "documents": return "Verwalten Sie wichtige Dokumente";
      default: return "Verwalten Sie Ihre persönlichen Informationen";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{getTabTitle()}</CardTitle>
            <CardDescription>{getTabDescription()}</CardDescription>
          </div>
          {hasUnsavedChanges && (
            <Button 
              variant="default" 
              className="flex items-center gap-2"
              onClick={handleSaveProfile}
              disabled={loading}
            >
              {loading ? (
                <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <SaveIcon className="h-4 w-4" />
              )}
              Änderungen speichern
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === "personal" && (
          <PersonalInfoTab 
            personalInfo={personalInfo}
            licenseInfo={licenseInfo}
            handleInputChange={handleInputChange}
            handleLicenseChange={handleLicenseChange}
          />
        )}
        
        {activeTab === "payment" && (
          <PaymentTab statistics={statistics} />
        )}
        
        {activeTab === "statistics" && (
          <StatisticsTab statistics={statistics} />
        )}
        
        {activeTab === "schedule" && (
          <ScheduleTab setHasUnsavedChanges={setHasUnsavedChanges} />
        )}
        
        {activeTab === "documents" && (
          <DocumentsTab />
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileContent;
