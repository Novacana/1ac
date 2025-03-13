
import React from "react";
import { User, CreditCard, BarChart, Clock, FileText } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserType } from "@/types/auth";

interface ProfileSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserType | null;
  personalInfo: {
    name: string;
    specialty: string;
    email: string;
    phone: string;
  };
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  user,
  personalInfo
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span>{personalInfo.name || "Dr. Schmidt"}</span>
          </div>
        </CardTitle>
        <CardDescription>
          {user?.verificationStatus === 'verified' 
            ? "Verifizierter Arzt" 
            : "Verifizierung ausstehend"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="border-t border-b px-4 py-3 bg-muted/40">
          <p className="text-sm font-medium">Profil-Navigation</p>
        </div>
        <div className="p-4 flex flex-col gap-1">
          <Button 
            variant={activeTab === "personal" ? "secondary" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("personal")}
          >
            <User className="h-4 w-4 mr-2" />
            Persönliche Daten
          </Button>
          <Button 
            variant={activeTab === "payment" ? "secondary" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("payment")}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Zahlungsinformationen
          </Button>
          <Button 
            variant={activeTab === "statistics" ? "secondary" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("statistics")}
          >
            <BarChart className="h-4 w-4 mr-2" />
            Statistiken
          </Button>
          <Button 
            variant={activeTab === "schedule" ? "secondary" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("schedule")}
          >
            <Clock className="h-4 w-4 mr-2" />
            Sprechzeiten
          </Button>
          <Button 
            variant={activeTab === "documents" ? "secondary" : "ghost"} 
            className="justify-start" 
            onClick={() => setActiveTab("documents")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Dokumente
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSidebar;
