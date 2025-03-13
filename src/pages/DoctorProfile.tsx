
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Stethoscope,
  User, 
  CreditCard,
  Clock, 
  BarChart,
  FileText,
  SaveIcon,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const DoctorProfile: React.FC = () => {
  const { user, isAuthenticated, isDoctor, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || "",
    specialty: "Allgemeinmedizin",
    email: user?.email || "",
    phone: user?.phone || ""
  });
  const [statistics, setStatistics] = useState({
    patientsCount: 0,
    prescriptionsCount: 0,
    consultationsCount: 0,
    totalRevenue: 0
  });
  const [licenseInfo, setLicenseInfo] = useState({
    licenseNumber: "",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
    specialty: ""
  });

  // Redirect non-doctor users
  if (isAuthenticated && !isDoctor) {
    navigate("/dashboard");
    return null;
  }

  // Redirect non-authenticated users
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  useEffect(() => {
    if (user && isDoctor) {
      loadDoctorData();
    }
  }, [user]);

  const loadDoctorData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch doctor statistics
      const { data: statsData, error: statsError } = await supabase
        .from('doctor_statistics')
        .select('*')
        .eq('doctor_id', user.id)
        .maybeSingle();
      
      if (statsError) throw statsError;
      
      if (statsData) {
        setStatistics({
          patientsCount: statsData.patients_treated || 0,
          prescriptionsCount: statsData.prescriptions_issued || 0,
          consultationsCount: statsData.consultations_completed || 0,
          totalRevenue: statsData.total_earnings || 0
        });
      }
      
      // Fetch license information
      const { data: licenseData, error: licenseError } = await supabase
        .from('medical_licenses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (licenseError) throw licenseError;
      
      if (licenseData) {
        setLicenseInfo({
          licenseNumber: licenseData.license_number || "",
          issuingAuthority: licenseData.issuing_authority || "",
          issueDate: licenseData.issue_date ? new Date(licenseData.issue_date).toISOString().split('T')[0] : "",
          expiryDate: licenseData.expiry_date ? new Date(licenseData.expiry_date).toISOString().split('T')[0] : "",
          specialty: licenseData.specialty || ""
        });
      }
      
      // Update personal info with actual user data
      setPersonalInfo({
        name: user.name || "",
        specialty: licenseData?.specialty || "Allgemeinmedizin",
        email: user.email || "",
        phone: user.phone || ""
      });
      
    } catch (error) {
      console.error('Error loading doctor data:', error);
      toast.error('Fehler beim Laden der Arztdaten');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Update user profile
      await updateUserProfile({
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone
      });
      
      // Log GDPR-compliant action
      await supabase.from('gdpr_logs').insert({
        user_id: user?.id,
        action_type: 'profile_update',
        description: 'User updated their profile information'
      });
      
      // Update license info if it exists
      if (licenseInfo.licenseNumber) {
        const { data, error } = await supabase
          .from('medical_licenses')
          .upsert({
            user_id: user?.id,
            license_number: licenseInfo.licenseNumber,
            issuing_authority: licenseInfo.issuingAuthority,
            issue_date: licenseInfo.issueDate,
            expiry_date: licenseInfo.expiryDate,
            specialty: licenseInfo.specialty,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });
          
        if (error) throw error;
      }
      
      toast.success("Profil erfolgreich aktualisiert");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Fehler beim Speichern des Profils');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleLicenseChange = (field: string, value: string) => {
    setLicenseInfo(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Arztprofil</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre persönlichen Informationen, Zahlungen und Statistiken
            </p>
          </div>

          {/* GDPR Compliance Notice */}
          <Alert className="mb-6">
            <Shield className="h-4 w-4" />
            <AlertTitle>GDPR & HIPAA Konformität</AlertTitle>
            <AlertDescription>
              Ihre Daten werden gemäß der DSGVO und HIPAA-Richtlinien verarbeitet. 
              Sämtliche Änderungen werden protokolliert und können jederzeit eingesehen werden.
            </AlertDescription>
          </Alert>

          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      <span>{personalInfo.name || "Dr. Schmidt"}</span>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {user?.verificationStatus === 'verified' 
                      ? "Verifizierter Arzt" 
                      : "Verifizierung ausstehend"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="border-t border-b px-4 py-3 bg-muted/40">
                    <p className="text-sm font-medium">Profil-Navigation</p>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <Button 
                      variant={activeTab === "personal" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("personal")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Persönliche Daten
                    </Button>
                    <Button 
                      variant={activeTab === "payment" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("payment")}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Zahlungsinformationen
                    </Button>
                    <Button 
                      variant={activeTab === "statistics" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("statistics")}
                    >
                      <BarChart className="h-4 w-4 mr-2" />
                      Statistiken
                    </Button>
                    <Button 
                      variant={activeTab === "schedule" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("schedule")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Sprechzeiten
                    </Button>
                    <Button 
                      variant={activeTab === "documents" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("documents")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Dokumente
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>
                        {activeTab === "personal" && "Persönliche Daten"}
                        {activeTab === "payment" && "Zahlungsinformationen"}
                        {activeTab === "statistics" && "Statistiken"}
                        {activeTab === "schedule" && "Sprechzeiten"}
                        {activeTab === "documents" && "Dokumente"}
                      </CardTitle>
                      <CardDescription>
                        {activeTab === "personal" && "Verwalten Sie Ihre persönlichen Informationen"}
                        {activeTab === "payment" && "Verwalten Sie Ihre Zahlungsmethoden und Abrechnungen"}
                        {activeTab === "statistics" && "Einsicht in Ihre Praxisstatistiken"}
                        {activeTab === "schedule" && "Legen Sie Ihre Verfügbarkeit und Sprechzeiten fest"}
                        {activeTab === "documents" && "Verwalten Sie wichtige Dokumente"}
                      </CardDescription>
                    </div>
                    {hasUnsavedChanges && (
                      <Button 
                        variant="default" 
                        className="flex items-center gap-2"
                        onClick={handleSaveProfile}
                        disabled={loading}
                      >
                        {loading ? (
                          <div className="h-4 w-4 border-2 border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <SaveIcon className="h-4 w-4" />
                        )}
                        Änderungen speichern
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {activeTab === "personal" && (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                        <div className="h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <User className="h-16 w-16" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{personalInfo.name || "Dr. Schmidt"}</h3>
                          <p className="text-muted-foreground">{personalInfo.email || "doctor@example.com"}</p>
                          <p className="mt-2">{personalInfo.specialty}</p>
                          <Button variant="outline" size="sm" className="mt-3">
                            Profilbild ändern
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium">Vollständiger Name</label>
                          <input 
                            type="text" 
                            className="w-full mt-1 p-2 border rounded-md" 
                            value={personalInfo.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Fachgebiet</label>
                          <input 
                            type="text" 
                            className="w-full mt-1 p-2 border rounded-md" 
                            value={personalInfo.specialty}
                            onChange={(e) => handleInputChange('specialty', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">E-Mail</label>
                          <input 
                            type="email" 
                            className="w-full mt-1 p-2 border rounded-md" 
                            value={personalInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Telefon</label>
                          <input 
                            type="tel" 
                            className="w-full mt-1 p-2 border rounded-md" 
                            value={personalInfo.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-8 border-t pt-6">
                        <h3 className="text-lg font-medium mb-4">Approbationsdaten</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium">Approbationsnummer</label>
                            <input 
                              type="text" 
                              className="w-full mt-1 p-2 border rounded-md" 
                              value={licenseInfo.licenseNumber}
                              onChange={(e) => handleLicenseChange('licenseNumber', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ausstellende Behörde</label>
                            <input 
                              type="text" 
                              className="w-full mt-1 p-2 border rounded-md" 
                              value={licenseInfo.issuingAuthority}
                              onChange={(e) => handleLicenseChange('issuingAuthority', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ausstellungsdatum</label>
                            <input 
                              type="date" 
                              className="w-full mt-1 p-2 border rounded-md" 
                              value={licenseInfo.issueDate}
                              onChange={(e) => handleLicenseChange('issueDate', e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Ablaufdatum (falls zutreffend)</label>
                            <input 
                              type="date" 
                              className="w-full mt-1 p-2 border rounded-md" 
                              value={licenseInfo.expiryDate}
                              onChange={(e) => handleLicenseChange('expiryDate', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "payment" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Abrechnungsinformationen</h3>
                      <div className="bg-muted/30 rounded-lg p-6 border">
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Aktuelle Periode</span>
                          <span>{new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Bearbeitete Rezepte</span>
                          <span>{statistics.prescriptionsCount}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Ausstehender Betrag</span>
                          <span className="font-bold">€{(statistics.prescriptionsCount * 20).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Nächste Auszahlung</span>
                          <span>{new Date(new Date().setDate(new Date().getDate() + 5)).toLocaleDateString('de-DE')}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium pt-4">Zahlungsmethoden</h3>
                      <div className="bg-muted/30 rounded-lg p-6 border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-10 w-10 text-primary" />
                            <div>
                              <p className="font-medium">SEPA-Bankverbindung</p>
                              <p className="text-sm text-muted-foreground">DE89 3704 0044 0532 0130 00</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">Bearbeiten</Button>
                        </div>
                      </div>
                      
                      <Button className="w-full md:w-auto">Zahlungsmethode hinzufügen</Button>
                    </div>
                  )}
                  
                  {activeTab === "statistics" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <h3 className="text-3xl font-bold">{statistics.prescriptionsCount}</h3>
                              <p className="text-sm text-muted-foreground mt-1">Rezepte insgesamt</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <h3 className="text-3xl font-bold">{statistics.patientsCount}</h3>
                              <p className="text-sm text-muted-foreground mt-1">Patienten</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <h3 className="text-3xl font-bold">€{statistics.totalRevenue.toFixed(2)}</h3>
                              <p className="text-sm text-muted-foreground mt-1">Gesamtumsatz</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="bg-muted/30 p-6 rounded-lg border h-64 flex items-center justify-center">
                        <p className="text-muted-foreground">Statistik-Diagramme werden hier angezeigt</p>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "schedule" && (
                    <div className="space-y-6">
                      <div className="bg-muted/30 p-6 rounded-lg border">
                        <h3 className="text-lg font-medium mb-4">Sprechzeiten</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium">Montag</label>
                            <div className="flex gap-2 mt-1">
                              <input 
                                type="time" 
                                className="w-full p-2 border rounded-md" 
                                defaultValue="09:00"
                                onChange={() => setHasUnsavedChanges(true)}
                              />
                              <span className="flex items-center">-</span>
                              <input 
                                type="time" 
                                className="w-full p-2 border rounded-md" 
                                defaultValue="17:00"
                                onChange={() => setHasUnsavedChanges(true)}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Dienstag</label>
                            <div className="flex gap-2 mt-1">
                              <input 
                                type="time" 
                                className="w-full p-2 border rounded-md" 
                                defaultValue="09:00"
                                onChange={() => setHasUnsavedChanges(true)}
                              />
                              <span className="flex items-center">-</span>
                              <input 
                                type="time" 
                                className="w-full p-2 border rounded-md" 
                                defaultValue="17:00"
                                onChange={() => setHasUnsavedChanges(true)}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Mittwoch</label>
                            <div className="flex gap-2 mt-1">
                              <input 
                                type="time" 
                                className="w-full p-2 border rounded-md" 
                                defaultValue="09:00"
                                onChange={() => setHasUnsavedChanges(true)}
                              />
                              <span className="flex items-center">-</span>
                              <input 
                                type="time" 
                                className="w-full p-2 border rounded-md" 
                                defaultValue="17:00"
                                onChange={() => setHasUnsavedChanges(true)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "documents" && (
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium">Approbationsnachweise</h3>
                      <div className="bg-muted/30 rounded-lg p-6 border">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                          <div className="mx-auto flex flex-col items-center justify-center gap-1">
                            <FileText className="h-10 w-10 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground mt-2">
                              Ziehen Sie Ihre Approbationsurkunde hierher oder klicken Sie zum Hochladen
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                              PDF, JPG oder PNG (max. 10MB)
                            </p>
                            <Button className="mt-4">
                              Datei auswählen
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-medium mt-6">Facharztnachweise</h3>
                      <div className="bg-muted/30 rounded-lg p-6 border">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                          <div className="mx-auto flex flex-col items-center justify-center gap-1">
                            <FileText className="h-10 w-10 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground mt-2">
                              Ziehen Sie Ihre Facharztanerkennung hierher oder klicken Sie zum Hochladen
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                              PDF, JPG oder PNG (max. 10MB)
                            </p>
                            <Button className="mt-4">
                              Datei auswählen
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorProfile;
