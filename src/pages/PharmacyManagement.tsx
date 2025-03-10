
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PharmacyHeader from "@/components/pharmacy/PharmacyHeader";
import ProductsTab from "@/components/pharmacy/tabs/ProductsTab";
import IntegrationsTab from "@/components/pharmacy/tabs/IntegrationsTab";
import NewProductDialog from "@/components/pharmacy/dialogs/NewProductDialog";
import ImportProductsDialog from "@/components/pharmacy/dialogs/ImportProductsDialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clipboard, FileText, ShoppingCart, Users } from "lucide-react";

const PharmacyManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("inventory");
  const [showNewProductDialog, setShowNewProductDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // New product form state
  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");

  // Handle authentication check with useEffect instead of early return
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // If not authenticated, render a loading placeholder until the navigation happens
  if (!isAuthenticated) {
    return <div className="loading-placeholder">Loading...</div>;
  }

  const handleImport = () => {
    setShowImportDialog(true);
  };

  const handleAddProduct = () => {
    setShowNewProductDialog(true);
  };

  // Dashboard overview card components
  const DashboardOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-blue-500" />
            Inventar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">42</div>
          <p className="text-muted-foreground text-sm">Produkte insgesamt</p>
          <div className="mt-2 text-xs text-green-600">+3 seit letzter Woche</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-4 w-4 text-amber-500" />
            Rezepte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">17</div>
          <p className="text-muted-foreground text-sm">Offene Rezeptanfragen</p>
          <div className="mt-2 text-xs text-amber-600">5 neue heute</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Clipboard className="h-4 w-4 text-green-500" />
            Bestellungen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-muted-foreground text-sm">Ausgehende Bestellungen</p>
          <div className="mt-2 text-xs text-green-600">8 bereit zum Versand</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-purple-500" />
            Kunden
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <p className="text-muted-foreground text-sm">Aktive Kunden</p>
          <div className="mt-2 text-xs text-purple-600">12 neue diesen Monat</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <PharmacyHeader 
            onImport={handleImport} 
            onAddProduct={handleAddProduct} 
          />

          {/* Dashboard Overview Cards */}
          <DashboardOverview />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
              <TabsTrigger value="inventory">Inventar</TabsTrigger>
              <TabsTrigger value="prescriptions">Rezepte</TabsTrigger>
              <TabsTrigger value="orders">Bestellungen</TabsTrigger>
              <TabsTrigger value="integrations">Apothekensysteme</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="inventory">
                <ProductsTab />
              </TabsContent>
              
              <TabsContent value="prescriptions">
                <Card>
                  <CardHeader>
                    <CardTitle>Rezeptverwaltung</CardTitle>
                    <CardDescription>
                      Bearbeiten Sie eingehende Rezeptanfragen und verfolgen Sie deren Status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center text-muted-foreground">
                      <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Rezeptverwaltung ist derzeit in Entwicklung</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>Bestellverwaltung</CardTitle>
                    <CardDescription>
                      Sehen und bearbeiten Sie ausgehende Bestellungen von Kunden
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="py-8 text-center text-muted-foreground">
                      <ShoppingCart className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Bestellverwaltung ist derzeit in Entwicklung</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integrations">
                <IntegrationsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Dialogs */}
      <NewProductDialog
        open={showNewProductDialog}
        onOpenChange={setShowNewProductDialog}
        productName={productName}
        setProductName={setProductName}
        productCategory={productCategory}
        setProductCategory={setProductCategory}
        productPrice={productPrice}
        setProductPrice={setProductPrice}
        productDescription={productDescription}
        setProductDescription={setProductDescription}
      />

      <ImportProductsDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
      />
    </Layout>
  );
};

export default PharmacyManagement;
