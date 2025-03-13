
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PersonalInfoTabProps {
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
  handleInputChange: (field: string, value: string) => void;
  handleLicenseChange: (field: string, value: string) => void;
}

const PersonalInfoTab: React.FC<PersonalInfoTabProps> = ({
  personalInfo,
  licenseInfo,
  handleInputChange,
  handleLicenseChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
        <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <User className="h-16 w-16" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{personalInfo.name || "Dr. Schmidt"}</h3>
          <p className="text-muted-foreground">{personalInfo.email || "doctor@example.com"}</p>
          <p className="mt-2">{personalInfo.specialty}</p>
          <Button variant="outline" size="sm" className="mt-3">
            Profilbild ändern
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium">Vollständiger Name</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 border rounded-md" 
            value={personalInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Fachgebiet</label>
          <input 
            type="text" 
            className="w-full mt-1 p-2 border rounded-md" 
            value={personalInfo.specialty}
            onChange={(e) => handleInputChange('specialty', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">E-Mail</label>
          <input 
            type="email" 
            className="w-full mt-1 p-2 border rounded-md" 
            value={personalInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Telefon</label>
          <input 
            type="tel" 
            className="w-full mt-1 p-2 border rounded-md" 
            value={personalInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium mb-4">Approbationsdaten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Approbationsnummer</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 border rounded-md" 
              value={licenseInfo.licenseNumber}
              onChange={(e) => handleLicenseChange('licenseNumber', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ausstellende Behörde</label>
            <input 
              type="text" 
              className="w-full mt-1 p-2 border rounded-md" 
              value={licenseInfo.issuingAuthority}
              onChange={(e) => handleLicenseChange('issuingAuthority', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ausstellungsdatum</label>
            <input 
              type="date" 
              className="w-full mt-1 p-2 border rounded-md" 
              value={licenseInfo.issueDate}
              onChange={(e) => handleLicenseChange('issueDate', e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Ablaufdatum (falls zutreffend)</label>
            <input 
              type="date" 
              className="w-full mt-1 p-2 border rounded-md" 
              value={licenseInfo.expiryDate}
              onChange={(e) => handleLicenseChange('expiryDate', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoTab;
