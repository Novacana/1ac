
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Calendar, Video, InboxIcon, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  activeSection: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar';
  onSectionChange: (section: 'prescriptions' | 'patients' | 'open_requests' | 'video' | 'calendar') => void;
}

const MobileNavigationItem = ({ 
  icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center gap-1 w-full p-2 rounded-md",
      active ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-background/80"
    )}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeSection, onSectionChange }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-sm border-t border-border md:hidden">
      <div className="grid grid-cols-6 gap-1 p-2">
        <MobileNavigationItem
          icon={<FileText className="h-5 w-5" />}
          label="Rezepte"
          active={activeSection === 'prescriptions'}
          onClick={() => onSectionChange('prescriptions')}
        />
        <MobileNavigationItem
          icon={<Users className="h-5 w-5" />}
          label="Patienten"
          active={activeSection === 'patients'}
          onClick={() => onSectionChange('patients')}
        />
        <MobileNavigationItem
          icon={<InboxIcon className="h-5 w-5" />}
          label="Anfragen"
          active={activeSection === 'open_requests'}
          onClick={() => onSectionChange('open_requests')}
        />
        <MobileNavigationItem
          icon={<Calendar className="h-5 w-5" />}
          label="Kalender"
          active={activeSection === 'calendar'}
          onClick={() => onSectionChange('calendar')}
        />
        <MobileNavigationItem
          icon={<Video className="h-5 w-5" />}
          label="Video"
          active={activeSection === 'video'}
          onClick={() => onSectionChange('video')}
        />
        <MobileNavigationItem
          icon={<User className="h-5 w-5" />}
          label="Profil"
          active={false}
          onClick={() => navigate('/doctor/profile')}
        />
      </div>
    </div>
  );
};

export default MobileNavigation;
