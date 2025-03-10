
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
  Building, 
  User, 
  MapPin, 
  Clock, 
  Image as ImageIcon,
  SaveIcon, 
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

// Profile tabs
import BusinessInfoTab from "@/components/pharmacy/profile/BusinessInfoTab";
import ContactInfoTab from "@/components/pharmacy/profile/ContactInfoTab";
import OpeningHoursTab from "@/components/pharmacy/profile/OpeningHoursTab";
import PhotosTab from "@/components/pharmacy/profile/PhotosTab";
import VerificationTab from "@/components/pharmacy/profile/VerificationTab";

const PharmacyProfile: React.FC = () => {
  const { user, isAuthenticated, isPharmacy, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("business");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isVerificationComplete, setIsVerificationComplete] = useState(
    user?.identificationStatus === 'verified' && 
    user?.verificationStatus === 'verified'
  );

  // Redirect non-pharmacy users
  if (isAuthenticated && !isPharmacy) {
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
            <h1 className="text-3xl font-bold">Apotheken-Profil</h1>
            <p className="text-muted-foreground">
              Verwalten Sie Ihre Geschäftsinformationen und Apotheken-Profil
            </p>
          </div>

          {/* Verification Banner */}
          {!isVerificationComplete && (
            <Card className="mb-6 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="flex items-center gap-3 py-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div className="flex-1">
                  <p className="font-medium text-amber-800 dark:text-amber-400">
                    Ihre Apotheke ist noch nicht vollständig verifiziert
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300/80">
                    Bitte vervollständigen Sie die Verifizierung, um alle Funktionen nutzen zu können.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
                  onClick={() => setActiveTab("verification")}
                >
                  Zur Verifizierung
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      <span>{user?.name || "Ihre Apotheke"}</span>
                    </div>
                  </CardTitle>
                  <CardDescription>
                    {user?.verificationStatus === 'verified' 
                      ? "Verifizierte Apotheke" 
                      : "Noch nicht verifiziert"}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-0">
                  <div className="border-t border-b px-4 py-3 bg-muted/40">
                    <p className="text-sm font-medium">Profil-Navigation</p>
                  </div>
                  <div className="p-4 flex flex-col gap-1">
                    <Button 
                      variant={activeTab === "business" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("business")}
                    >
                      <Building className="h-4 w-4 mr-2" />
                      Geschäftsinformationen
                    </Button>
                    <Button 
                      variant={activeTab === "contact" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("contact")}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Kontaktinformationen
                    </Button>
                    <Button 
                      variant={activeTab === "location" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("location")}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Standort & Adresse
                    </Button>
                    <Button 
                      variant={activeTab === "hours" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("hours")}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Öffnungszeiten
                    </Button>
                    <Button 
                      variant={activeTab === "photos" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("photos")}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Fotos
                    </Button>
                    <Button 
                      variant={activeTab === "verification" ? "secondary" : "ghost"} 
                      className="justify-start" 
                      onClick={() => setActiveTab("verification")}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Verifizierung
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
                        {activeTab === "business" && "Geschäftsinformationen"}
                        {activeTab === "contact" && "Kontaktinformationen"}
                        {activeTab === "location" && "Standort & Adresse"}
                        {activeTab === "hours" && "Öffnungszeiten"}
                        {activeTab === "photos" && "Fotos"}
                        {activeTab === "verification" && "Verifizierung"}
                      </CardTitle>
                      <CardDescription>
                        {activeTab === "business" && "Grundlegende Informationen zu Ihrer Apotheke"}
                        {activeTab === "contact" && "Kontaktdaten für Kunden und Lieferanten"}
                        {activeTab === "location" && "Standort- und Adressdaten Ihrer Apotheke"}
                        {activeTab === "hours" && "Verfügbarkeit und Öffnungszeiten"}
                        {activeTab === "photos" && "Bilder Ihrer Apotheke und Räumlichkeiten"}
                        {activeTab === "verification" && "Dokumente und Nachweise zur Verifizierung"}
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
                  {activeTab === "business" && 
                    <BusinessInfoTab 
                      user={user} 
                      onChange={() => setHasUnsavedChanges(true)} 
                    />
                  }
                  {activeTab === "contact" && 
                    <ContactInfoTab 
                      user={user} 
                      onChange={() => setHasUnsavedChanges(true)} 
                    />
                  }
                  {activeTab === "location" && 
                    <div className="py-4">
                      <p className="text-muted-foreground text-center">
                        Standort-Verwaltung ist in Entwicklung
                      </p>
                    </div>
                  }
                  {activeTab === "hours" && 
                    <OpeningHoursTab 
                      onChange={() => setHasUnsavedChanges(true)} 
                    />
                  }
                  {activeTab === "photos" && 
                    <PhotosTab 
                      onChange={() => setHasUnsavedChanges(true)} 
                    />
                  }
                  {activeTab === "verification" && 
                    <VerificationTab 
                      user={user} 
                      updateStatus={(status) => setIsVerificationComplete(status)} 
                    />
                  }
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PharmacyProfile;
