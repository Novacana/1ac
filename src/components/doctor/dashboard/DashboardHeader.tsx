
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Users, Calendar, Video, InboxIcon, User } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  mainSection: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar';
  onSectionChange: (section: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar') => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ mainSection, onSectionChange }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  return (
    <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center justify-between'} w-full gap-3 mb-4`}>
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row items-center'} gap-3`}>
        <h1 className={`text-2xl font-bold ${isMobile ? 'mb-2' : 'mr-4'}`}>Ärzte Dashboard</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={mainSection === 'prescriptions' ? "default" : "outline"} 
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
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
            Offene Anfragen
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
        <User className="h-4 w-4" />
        Arztprofil
      </Button>
    </div>
  );
};

export default DashboardHeader;
