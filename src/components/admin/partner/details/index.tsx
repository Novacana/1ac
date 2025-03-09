
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PiggyBank, Calendar, Save } from "lucide-react";
import { Partner } from "../../PartnerConfig";

import PartnerHeader from "./PartnerHeader";
import DetailsTab from "./DetailsTab";
import FinancialTab from "./FinancialTab";
import ActivityTab from "./ActivityTab";
import GDPRConsent from "./GDPRConsent";

interface PartnerDetailsProps {
  partner: Partner;
  onUpdate: (partner: Partner) => void;
  onBack: () => void;
}

const PartnerDetails: React.FC<PartnerDetailsProps> = ({ 
  partner, 
  onUpdate, 
  onBack 
}) => {
  const [editedPartner, setEditedPartner] = useState<Partner>({...partner});
  const [activeTab, setActiveTab] = useState("details");
  const [gdprConsent, setGdprConsent] = useState(false);

  const handleSave = () => {
    if (!gdprConsent) {
      // Show GDPR consent requirement
      setActiveTab("details");
      return;
    }
    onUpdate(editedPartner);
  };

  const handlePartnerChange = (updatedPartner: Partner) => {
    setEditedPartner(updatedPartner);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <PartnerHeader partner={editedPartner} />
          <CardDescription>
            Partner seit {editedPartner.joinDate} | ID: {editedPartner.id}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="details">
                <FileText className="h-4 w-4 mr-2" />
                Details
              </TabsTrigger>
              <TabsTrigger value="financial">
                <PiggyBank className="h-4 w-4 mr-2" />
                Finanzen
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Calendar className="h-4 w-4 mr-2" />
                Aktivität
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <DetailsTab 
                partner={editedPartner} 
                onChange={handlePartnerChange} 
              />
              <GDPRConsent 
                checked={gdprConsent} 
                onCheckedChange={setGdprConsent} 
              />
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-6">
              <FinancialTab 
                partner={editedPartner} 
                onChange={handlePartnerChange} 
              />
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <ActivityTab />
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2 border-t p-4">
          <Button variant="outline" onClick={onBack}>
            Abbrechen
          </Button>
          <Button 
            onClick={handleSave} 
            className="flex items-center gap-2"
            disabled={!gdprConsent}
          >
            <Save className="h-4 w-4" />
            Änderungen speichern
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PartnerDetails;
