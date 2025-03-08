
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfile from "@/components/user/UserProfile";
import UserOrders from "@/components/user/UserOrders";
import UserConsultations from "@/components/user/UserConsultations";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserIcon, PackageIcon, MessageSquareIcon } from "lucide-react";
import { toast } from "sonner";

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    toast.info("Erfolgreich abgemeldet");
    navigate("/");
  };

  return (
    <Layout>
      <div className="container px-4 mx-auto py-8 animate-fade-in">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Mein Konto</h1>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Abmelden
            </Button>
          </div>

          <Card className="mb-6 p-6">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </Card>

          <Tabs
            defaultValue="profile"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <PackageIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Bestellungen</span>
              </TabsTrigger>
              <TabsTrigger value="consultations" className="flex items-center gap-2">
                <MessageSquareIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Konsultationen</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <UserProfile user={user} />
            </TabsContent>
            <TabsContent value="orders">
              <UserOrders />
            </TabsContent>
            <TabsContent value="consultations">
              <UserConsultations />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;
