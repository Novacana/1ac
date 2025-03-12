
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
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
  Book,
  FileText,
  SaveIcon
} from "lucide-react";
import { toast } from "sonner";

const DoctorProfile: React.FC = () => {
  const { user, isAuthenticated, isDoctor } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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

  const handleSaveProfile = () => {
    // Save all profile data
    toast.success("Profil erfolgreich aktualisiert");
    setHasUnsavedChanges(false);
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

          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-5 w-5" />
                      <span>{user?.name || "Dr. Schmidt"}</span>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {user?.verificationStatus === 'verified' 
                      ? "Verifizierter Arzt" 
                      : "Verifizierter Arzt"}
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
                      >
                        <SaveIcon className="h-4 w-4" />
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
                          <h3 className="text-xl font-semibold">{user?.name || "Dr. Schmidt"}</h3>
                          <p className="text-muted-foreground">{user?.email || "doctor@example.com"}</p>
                          <p className="mt-2">Facharzt für Allgemeinmedizin</p>
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
                            defaultValue={user?.name || "Dr. Schmidt"}
                            onChange={() => setHasUnsavedChanges(true)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Fachgebiet</label>
                          <input 
                            type="text" 
                            className="w-full mt-1 p-2 border rounded-md" 
                            defaultValue="Allgemeinmedizin"
                            onChange={() => setHasUnsavedChanges(true)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">E-Mail</label>
                          <input 
                            type="email" 
                            className="w-full mt-1 p-2 border rounded-md" 
                            defaultValue={user?.email || "doctor@example.com"}
                            onChange={() => setHasUnsavedChanges(true)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Telefon</label>
                          <input 
                            type="tel" 
                            className="w-full mt-1 p-2 border rounded-md" 
                            defaultValue="+49 123 456789"
                            onChange={() => setHasUnsavedChanges(true)}
                          />
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
                          <span>01.10.2023 - 31.10.2023</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Bearbeitete Rezepte</span>
                          <span>42</span>
                        </div>
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Ausstehender Betrag</span>
                          <span className="font-bold">€840,00</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Nächste Auszahlung</span>
                          <span>05.11.2023</span>
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
                              <h3 className="text-3xl font-bold">42</h3>
                              <p className="text-sm text-muted-foreground mt-1">Rezepte diesen Monat</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <h3 className="text-3xl font-bold">28</h3>
                              <p className="text-sm text-muted-foreground mt-1">Neue Patienten</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <h3 className="text-3xl font-bold">€840</h3>
                              <p className="text-sm text-muted-foreground mt-1">Umsatz diesen Monat</p>
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
                      <p className="text-center text-muted-foreground py-6">
                        Sprechzeiten-Verwaltung wird in Kürze verfügbar sein
                      </p>
                    </div>
                  )}
                  
                  {activeTab === "documents" && (
                    <div className="space-y-6">
                      <p className="text-center text-muted-foreground py-6">
                        Dokument-Verwaltung wird in Kürze verfügbar sein
                      </p>
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
