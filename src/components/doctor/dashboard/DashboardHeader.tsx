
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Users, Calendar, Video, InboxIcon, Stethoscope } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  mainSection: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar';
  onSectionChange: (section: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar') => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ mainSection, onSectionChange }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  if (isMobile) {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-sm border-b border-border">
        <h1 className="text-lg font-semibold">
          {mainSection === 'prescriptions' && 'Rezeptverwaltung'}
          {mainSection === 'patients' && 'Patientenverwaltung'}
          {mainSection === 'open_requests' && 'Rezeptanfragen'}
          {mainSection === 'calendar' && 'Kalender'}
          {mainSection === 'video' && 'Videosprechstunde'}
        </h1>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/doctor/profile')}
          className="rounded-full"
        >
          <Stethoscope className="h-5 w-5" />
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-row items-center justify-between w-full gap-3 mb-6">
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={mainSection === 'prescriptions' ? "default" : "outline"} 
            className="flex items-center gap-2"
            onClick={() => onSectionChange('prescriptions')}
          >
            <FileText className="h-4 w-4" />
            Rezeptverwaltung
          </Button>
          
          <Button 
            variant={mainSection === 'patients' ? "default" : "outline"} 
            className="flex items-center gap-2"
            onClick={() => onSectionChange('patients')}
          >
            <Users className="h-4 w-4" />
            Patientenverwaltung
          </Button>
          
          <Button 
            variant={mainSection === 'open_requests' ? "default" : "outline"} 
            className="flex items-center gap-2"
            onClick={() => onSectionChange('open_requests')}
          >
            <InboxIcon className="h-4 w-4" />
            Rezeptanfragen
          </Button>
          
          <Button 
            variant={mainSection === 'calendar' ? "default" : "outline"} 
            className="flex items-center gap-2"
            onClick={() => onSectionChange('calendar')}
          >
            <Calendar className="h-4 w-4" />
            Kalender
          </Button>
          
          <Button 
            variant={mainSection === 'video' ? "default" : "outline"} 
            className="flex items-center gap-2"
            onClick={() => onSectionChange('video')}
          >
            <Video className="h-4 w-4" />
            Videosprechstunde
          </Button>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => navigate('/doctor/profile')}
      >
        <Stethoscope className="h-4 w-4" />
        Arztprofil
      </Button>
    </div>
  );
};

export default DashboardHeader;
