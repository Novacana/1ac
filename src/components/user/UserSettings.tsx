
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCircle, Mail, Lock, Bell, Languages } from 'lucide-react';

const UserSettings = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6">
      {!isMobile && (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Kontoeinstellungen</h2>
        </div>
      )}
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>E-Mail</span>
          </TabsTrigger>
          <TabsTrigger value="password" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Passwort</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Einstellungen</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                Verwalten Sie Ihre Profilinformationen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstname">Vorname</Label>
                  <Input id="firstname" defaultValue={user?.firstName || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Nachname</Label>
                  <Input id="lastname" defaultValue={user?.lastName || ''} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Telefonnummer</Label>
                  <Input id="phone" defaultValue={user?.phone || ''} />
                </div>
              </div>
              <Button className="mt-4">Speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>E-Mail-Adresse</CardTitle>
              <CardDescription>
                Ändern Sie Ihre E-Mail-Adresse.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-email">Aktuelle E-Mail-Adresse</Label>
                <Input id="current-email" value={user?.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Neue E-Mail-Adresse</Label>
                <Input id="new-email" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-confirm">Passwort</Label>
                <Input id="password-confirm" type="password" />
              </div>
              <Button className="mt-4">E-Mail-Adresse ändern</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Passwort ändern</CardTitle>
              <CardDescription>
                Ändern Sie regelmäßig Ihr Passwort, um Ihre Sicherheit zu gewährleisten.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Aktuelles Passwort</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Neues Passwort</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="mt-4">Passwort ändern</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Einstellungen</CardTitle>
              <CardDescription>
                Passen Sie Ihre Benachrichtigungs- und Systemeinstellungen an.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Benachrichtigungen</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">E-Mail-Benachrichtigungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Erhalten Sie Benachrichtigungen per E-Mail.
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates">Bestellaktualisierungen</Label>
                    <p className="text-sm text-muted-foreground">
                      Erhalten Sie Updates zu Ihren Bestellungen.
                    </p>
                  </div>
                  <Switch id="order-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing-E-Mails</Label>
                    <p className="text-sm text-muted-foreground">
                      Erhalten Sie Angebote und Neuigkeiten.
                    </p>
                  </div>
                  <Switch id="marketing-emails" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">System</h3>
                <div className="space-y-2">
                  <Label htmlFor="language">Sprache</Label>
                  <Select defaultValue="de">
                    <SelectTrigger id="language" className="w-full sm:w-[240px]">
                      <SelectValue placeholder="Sprache auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button>Einstellungen speichern</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserSettings;
