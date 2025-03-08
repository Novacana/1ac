
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

const PharmacyManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <PharmacyHeader 
            onImport={handleImport} 
            onAddProduct={handleAddProduct} 
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
              <TabsTrigger value="products">Produkte</TabsTrigger>
              <TabsTrigger value="integrations">Integrationen</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="products">
                <ProductsTab />
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
