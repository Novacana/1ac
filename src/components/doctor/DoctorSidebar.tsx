import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Stethoscope, FileText, Users, InboxIcon, Video } from 'lucide-react';

interface DoctorSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
  onNavChange: (section: 'prescriptions' | 'patients' | 'open_requests' | 'video') => void;
  activeSection: 'prescriptions' | 'patients' | 'open_requests' | 'video';
}

const DoctorSidebar: React.FC<DoctorSidebarProps> = ({ user, onNavChange, activeSection }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Arztprofil
        </CardTitle>
      </CardHeader>
      
      <CardContent className="py-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-12 w-12" />
          </div>
          
          <div className="text-center">
            <h3 className="font-medium text-lg">{user?.name || 'Dr. Schmidt'}</h3>
            <p className="text-sm text-muted-foreground">{user?.email || 'doctor@example.com'}</p>
          </div>
          
          <div className="w-full pt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">Online</span>
            </div>
            
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Rolle:</span>
              <span className="font-medium capitalize">{user?.role || 'Arzt'}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ausstehende Anfragen:</span>
              <span className="font-medium">5</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <Button 
            variant={activeSection === 'open_requests' ? "default" : "outline"} 
            className="w-full flex items-center gap-2 justify-start"
            onClick={() => onNavChange('open_requests')}
          >
            <InboxIcon className="h-4 w-4" />
            Offene Anfragen
          </Button>

          <Button 
            variant={activeSection === 'prescriptions' ? "default" : "outline"} 
            className="w-full flex items-center gap-2 justify-start"
            onClick={() => onNavChange('prescriptions')}
          >
            <FileText className="h-4 w-4" />
            Rezeptverwaltung
          </Button>

          <Button 
            variant={activeSection === 'patients' ? "default" : "outline"} 
            className="w-full flex items-center gap-2 justify-start"
            onClick={() => onNavChange('patients')}
          >
            <Users className="h-4 w-4" />
            Patientenverwaltung
          </Button>

          <Button 
            variant={activeSection === 'video' ? "default" : "outline"} 
            className="w-full flex items-center gap-2 justify-start"
            onClick={() => onNavChange('video')}
          >
            <Video className="h-4 w-4" />
            Videosprechstunde
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="w-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Abmelden
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DoctorSidebar;
