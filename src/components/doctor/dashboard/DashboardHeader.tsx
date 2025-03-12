
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardHeaderProps {
  mainSection: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar';
  onSectionChange: (section: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar') => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ mainSection, onSectionChange }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'items-center'} w-full gap-3`}>
      <h1 className={`text-2xl font-bold ${isMobile ? 'mb-2' : 'mr-4'}`}>Arzt Dashboard</h1>
      <Button 
        variant={mainSection === 'prescriptions' ? "default" : "outline"} 
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
        onClick={() => onSectionChange('prescriptions')}
      >
        <FileText className="h-4 w-4" />
        Rezeptverwaltung
      </Button>
    </div>
  );
};

export default DashboardHeader;
