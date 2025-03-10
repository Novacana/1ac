
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, UserCircle, FileCheck, BadgeCheck, Building, Fingerprint } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserSettings from '@/components/user/UserSettings';
import UserIdentification from '@/components/user/UserIdentification';
import { useAuth } from '@/contexts/AuthContext';

const Settings = () => {
  const { user, isDoctor, isPharmacy } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    return (
      <Layout>
        <div className="container py-12">
          <Alert variant="destructive">
            <Shield className="h-4 w-4" />
            <AlertTitle>Nicht autorisiert</AlertTitle>
            <AlertDescription>
              Bitte melden Sie sich an, um auf Ihre Kontoeinstellungen zuzugreifen.
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCircle className="h-5 w-5" />
                  {user.name}
                </CardTitle>
                <CardDescription>
                  {isDoctor ? 'Arzt-Konto' : isPharmacy ? 'Apotheken-Konto' : 'Kundenkonto'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue={activeTab} 
                  orientation="vertical" 
                  onValueChange={setActiveTab} 
                  className="w-full"
                >
                  <TabsList className="flex flex-col h-auto items-stretch gap-1">
                    <TabsTrigger value="profile" className="justify-start">
                      <UserCircle className="h-4 w-4 mr-2" />
                      Benutzerprofil
                    </TabsTrigger>
                    <TabsTrigger value="identification" className="justify-start">
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Identifikation
                    </TabsTrigger>
                    {isDoctor && (
                      <TabsTrigger value="verification" className="justify-start">
                        <FileCheck className="h-4 w-4 mr-2" />
                        Approbation
                      </TabsTrigger>
                    )}
                    {isPharmacy && (
                      <TabsTrigger value="pharmacy" className="justify-start">
                        <Building className="h-4 w-4 mr-2" />
                        Apothekendaten
                      </TabsTrigger>
                    )}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            {user.verificationStatus && (
              <Card className="mt-4">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <BadgeCheck className="h-4 w-4 text-green-500" />
                    {user.verificationStatus === 'verified' ? (
                      <span className="text-green-600">Vollständig verifiziert</span>
                    ) : (
                      <span className="text-amber-600">Verifizierung ausstehend</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="md:w-3/4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="profile" className="mt-0">
                <UserSettings />
              </TabsContent>
              
              <TabsContent value="identification" className="mt-0">
                <UserIdentification />
              </TabsContent>
              
              {isDoctor && (
                <TabsContent value="verification" className="mt-0">
                  <DoctorVerification />
                </TabsContent>
              )}
              
              {isPharmacy && (
                <TabsContent value="pharmacy" className="mt-0">
                  <PharmacySettings />
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Komponente für die Arzt-Approbationsverifizierung
const DoctorVerification = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Approbationsnachweise</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Approbationsurkunde
          </CardTitle>
          <CardDescription>
            Laden Sie hier Ihre Approbationsurkunde hoch für die Verifizierung
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <div className="mx-auto flex flex-col items-center justify-center gap-1">
                <FileCheck className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground mt-2">
                  Ziehen Sie Ihre Approbationsurkunde hierher oder klicken Sie zum Hochladen
                </p>
                <p className="text-xs text-muted-foreground/70">
                  PDF, JPG oder PNG (max. 10MB)
                </p>
                <button className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">
                  Datei auswählen
                </button>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Datenschutzhinweis</AlertTitle>
              <AlertDescription>
                Ihre Dokumente werden verschlüsselt gespeichert und nur zur Überprüfung Ihrer Arztidentität verwendet. 
                Alle Daten werden gemäß DSGVO und HIPAA-Richtlinien verarbeitet.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Komponente für Apotheken-Einstellungen
const PharmacySettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Apothekendaten</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Apothekennachweis
          </CardTitle>
          <CardDescription>
            Verwalten Sie hier Ihre Apotheke und die Betriebserlaubnis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              <div className="mx-auto flex flex-col items-center justify-center gap-1">
                <Building className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground mt-2">
                  Laden Sie hier Ihre Betriebserlaubnis hoch
                </p>
                <p className="text-xs text-muted-foreground/70">
                  PDF, JPG oder PNG (max. 10MB)
                </p>
                <button className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground">
                  Datei auswählen
                </button>
              </div>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Datenschutzhinweis</AlertTitle>
              <AlertDescription>
                Ihre Dokumente werden verschlüsselt gespeichert und nur zur Überprüfung Ihrer Apothekenidentität verwendet. 
                Alle Daten werden gemäß DSGVO und HIPAA-Richtlinien verarbeitet.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
