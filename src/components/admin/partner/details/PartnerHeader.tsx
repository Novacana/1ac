
import React from "react";
import { Building2 } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Partner, PartnerType } from "../../PartnerConfig";

interface PartnerHeaderProps {
  partner: Partner;
}

const PartnerHeader: React.FC<PartnerHeaderProps> = ({ partner }) => {
  const getPartnerTypeLabel = (type: PartnerType) => {
    switch (type) {
      case "pharmacy": return "Apotheke";
      case "growshop": return "Growshop";
      case "seedshop": return "Seedshop";
      case "doctor": return "Arzt";
    }
  };
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <CardTitle>{partner.name}</CardTitle>
      </div>
      <Badge>
        {getPartnerTypeLabel(partner.type)}
      </Badge>
    </div>
  );
};

export default PartnerHeader;
