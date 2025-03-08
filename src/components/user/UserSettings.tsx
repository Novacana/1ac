
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const UserSettings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement profile update logic here
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
          <CardTitle>Persönliche Informationen</CardTitle>
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
            
            <Button type="submit">Speichern</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Passwort ändern</CardTitle>
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
