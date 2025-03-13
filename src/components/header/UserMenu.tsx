
import { User, Stethoscope, Building, BookOpen, Settings, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserType } from "@/types/auth";

interface UserMenuProps {
  user: UserType | null;
  isAuthenticated: boolean;
  isDoctor: boolean;
  isPharmacy: boolean;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({
  user,
  isAuthenticated,
  isDoctor,
  isPharmacy,
  onLogout,
}) => {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => navigate('/login')}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Anmelden</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mein Konto</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate(isDoctor ? '/doctor/profile' : '/dashboard')}>
          <User className="h-4 w-4 mr-2" />
          Mein Konto
        </DropdownMenuItem>
        {isDoctor && (
          <DropdownMenuItem onClick={() => navigate('/doctor/dashboard')}>
            <Stethoscope className="h-4 w-4 mr-2" />
            Arzt Dashboard
          </DropdownMenuItem>
        )}
        {isPharmacy && (
          <>
            <DropdownMenuItem onClick={() => navigate('/pharmacy/management')}>
              <Building className="h-4 w-4 mr-2" />
              Apotheken-Management
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/pharmacy/profile')}>
              <UserCircle className="h-4 w-4 mr-2" />
              Apotheken-Profil
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuItem onClick={() => navigate('/settings')}>
          <Settings className="h-4 w-4 mr-2" />
          Einstellungen
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/documentation')}>
          <BookOpen className="h-4 w-4 mr-2" />
          Dokumentation
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          Abmelden
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
