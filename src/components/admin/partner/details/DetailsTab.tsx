
import React from "react";
import { Partner } from "../../PartnerConfig";
import { PartnerBasicInfo } from "./details/PartnerBasicInfo";
import { PartnerContactInfo } from "./details/PartnerContactInfo";
import { PartnerBusinessInfo } from "./details/PartnerBusinessInfo";
import { PartnerNotes } from "./details/PartnerNotes";

interface DetailsTabProps {
  partner: Partner;
  onChange: (updatedPartner: Partner) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ partner, onChange }) => {
  const handleInputChange = (field: keyof Partner, value: string | boolean) => {
    onChange({
      ...partner,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PartnerBasicInfo 
          partner={partner} 
          onInputChange={handleInputChange} 
        />
        
        <PartnerContactInfo 
          partner={partner} 
          onInputChange={handleInputChange} 
        />
        
        <PartnerBusinessInfo 
          partner={partner} 
          onInputChange={handleInputChange} 
        />
      </div>
      
      <PartnerNotes 
        partner={partner} 
        onInputChange={handleInputChange} 
      />
    </div>
  );
};

export default DetailsTab;
