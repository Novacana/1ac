
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  LogOut, 
  ShoppingBag, 
  Package, 
  FileClock, 
  Settings, 
  Heart 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserSidebarProps {
  user: {
    name: string;
    email: string;
  } | null;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ user }) => {
  const { logout } = useAuth();
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: Package, 
      label: 'Bestellungen', 
      path: '/dashboard/orders' 
    },
    { 
      icon: FileClock, 
      label: 'Beratungen', 
      path: '/dashboard/consultations' 
    },
    { 
      icon: Heart, 
      label: 'Wunschliste', 
      path: '/dashboard/wishlist' 
    },
    { 
      icon: Settings, 
      label: 'Einstellungen', 
      path: '/dashboard/settings' 
    },
  ];

  return (
    <Card className="sticky top-20">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Mein Konto
        </CardTitle>
      </CardHeader>
      
      <CardContent className="py-6">
        <div className="flex flex-col items-center space-y-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-10 w-10" />
          </div>
          
          <div className="text-center">
            <h3 className="font-medium text-lg">{user?.name || 'Max Mustermann'}</h3>
            <p className="text-sm text-muted-foreground">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 text-sm rounded-md transition-colors",
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <Button 
          variant="outline" 
          onClick={() => logout()}
          className="w-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Abmelden
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserSidebar;
