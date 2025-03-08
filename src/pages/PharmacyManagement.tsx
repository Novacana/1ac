
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Upload, Download, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PharmacyProductsList from "@/components/pharmacy/PharmacyProductsList";
import PharmacyIntegrationSettings from "@/components/pharmacy/PharmacyIntegrationSettings";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleImportSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast.success("Produkte wurden erfolgreich importiert");
    setShowImportDialog(false);
  };

  const handleExport = () => {
    toast.success("Produkte wurden exportiert");
    
    // In a real app, this would trigger a file download
    // For now we'll simulate it with a timeout
    setTimeout(() => {
      const dummyLink = document.createElement('a');
      dummyLink.href = 'data:text/csv;charset=utf-8,Product,Category,Price,Stock\nCBD Öl 5%,Öle,29.99,50\nCBD Tropfen,Öle,19.99,30';
      dummyLink.download = 'pharmacy-products.csv';
      document.body.appendChild(dummyLink);
      dummyLink.click();
      document.body.removeChild(dummyLink);
    }, 500);
  };

  const handleAddProduct = () => {
    setShowNewProductDialog(true);
  };

  const handleNewProductSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!productName || !productCategory || !productPrice) {
      toast.error("Bitte alle Pflichtfelder ausfüllen");
      return;
    }
    
    toast.success(`Produkt "${productName}" wurde hinzugefügt`);
    
    // Reset form fields
    setProductName("");
    setProductCategory("");
    setProductPrice("");
    setProductDescription("");
    
    // Close dialog
    setShowNewProductDialog(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Link to="/">
                <Button variant="outline" size="sm" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück zum Shop
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Apotheken-Management</h1>
              <p className="text-muted-foreground mt-2">
                Verwalten Sie Ihre Produkte und Integrationen für Ihre Apotheke
              </p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleImport}
              >
                <Upload className="h-4 w-4" />
                Importieren
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleExport}
              >
                <Download className="h-4 w-4" />
                Exportieren
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={handleAddProduct}
              >
                <Plus className="h-4 w-4" />
                Neues Produkt
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
              <TabsTrigger value="products">Produkte</TabsTrigger>
              <TabsTrigger value="integrations">Integrationen</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Produkte</span>
                      <Badge variant="outline" className="ml-2">42 Produkte</Badge>
                    </CardTitle>
                    <CardDescription>
                      Verwalten Sie Ihre Apothekenprodukte und deren Verfügbarkeit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PharmacyProductsList />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="integrations">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <span>Integrationen</span>
                    </CardTitle>
                    <CardDescription>
                      Verbinden Sie Ihre Apothekensoftware mit unserem Shop.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PharmacyIntegrationSettings />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Add New Product Dialog */}
      <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Neues Produkt hinzufügen</DialogTitle>
            <DialogDescription>
              Fügen Sie die Details für das neue Produkt hinzu
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNewProductSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Produktname *</Label>
                <Input
                  id="name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="z.B. CBD Öl 5%"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Kategorie *</Label>
                <Select
                  value={productCategory}
                  onValueChange={setProductCategory}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oils">Öle</SelectItem>
                    <SelectItem value="flowers">Blüten</SelectItem>
                    <SelectItem value="edibles">Esswaren</SelectItem>
                    <SelectItem value="cosmetics">Kosmetik</SelectItem>
                    <SelectItem value="accessories">Zubehör</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Preis (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="19.99"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Produktbeschreibung hier eingeben..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowNewProductDialog(false)}>
                Abbrechen
              </Button>
              <Button type="submit">Produkt hinzufügen</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Produkte importieren</DialogTitle>
            <DialogDescription>
              Laden Sie eine CSV- oder Excel-Datei mit Ihren Produktdaten hoch
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleImportSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="file-upload">Datei auswählen</Label>
                <div className="border-2 border-dashed rounded-md p-6 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Datei hierher ziehen oder klicken zum Auswählen
                  </p>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    accept=".csv,.xlsx,.xls" 
                    className="sr-only"
                  />
                  <Button type="button" variant="outline" size="sm">
                    Datei auswählen
                  </Button>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <p>Unterstützte Dateiformate: CSV, Excel (.xlsx, .xls)</p>
                <p>Die Datei sollte folgende Spalten enthalten: Name, Kategorie, Preis, Bestand</p>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowImportDialog(false)}>
                Abbrechen
              </Button>
              <Button type="submit">Importieren</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PharmacyManagement;
