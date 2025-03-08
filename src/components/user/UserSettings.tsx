
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AddressManager from './AddressManager';
import PaymentMethodManager from './PaymentMethodManager';
import { UserCircle, Lock, Phone } from 'lucide-react';

const UserSettings = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    toast.success('Profil aktualisiert');
  };
  
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwörter stimmen nicht überein');
      return;
    }
    
    // Implement password update logic here
    toast.success('Passwort aktualisiert');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Kontoeinstellungen</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Persönliche Informationen
          </CardTitle>
          <CardDescription>
            Aktualisieren Sie Ihre persönlichen Daten
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail-Adresse</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefonnummer</Label>
              <Input 
                id="phone" 
                type="tel" 
                value={phone || ''} 
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+49 123 456789"
              />
            </div>
            
            <Button type="submit">Speichern</Button>
          </form>
        </CardContent>
      </Card>
      
      <AddressManager />
      
      <PaymentMethodManager />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Passwort ändern
          </CardTitle>
          <CardDescription>
            Aktualisieren Sie Ihr Passwort regelmäßig für mehr Sicherheit
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Aktuelles Passwort</Label>
              <Input 
                id="currentPassword" 
                type="password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">Neues Passwort</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit">Passwort ändern</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
