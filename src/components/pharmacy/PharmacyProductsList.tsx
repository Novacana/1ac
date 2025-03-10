import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Edit, Trash2, Eye, CheckCircle, XCircle, Filter, ShoppingCart
} from "lucide-react";
import { Product } from "@/types/product";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const PharmacyProductsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);
  const [offeredInShop, setOfferedInShop] = useState<Record<string, boolean>>({});
  const [inventoryLevels, setInventoryLevels] = useState<Record<string, number>>({});

  // Load pharmacy products from integrations only
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with a dedicated pharmacy products API endpoint
        const { loadProductsFromAllSources } = await import("@/hooks/useProductSources");
        const { allProducts } = await loadProductsFromAllSources("All", false);
        
        // Only keep products from integrations (WooCommerce, Shopify) or local pharmacy inventory
        const pharmacyProducts = allProducts.filter(product => 
          product.source === "woocommerce" || 
          product.source === "shopify" || 
          product.source === "pharmacy"
        );
        
        console.log(`Loaded ${pharmacyProducts.length} pharmacy products`);
        setProducts(pharmacyProducts);
        
        // Initialize offered in shop state and inventory levels
        const initialOfferedState = {};
        const initialInventoryLevels = {};
        pharmacyProducts.forEach(product => {
          initialOfferedState[product.id] = product.source === "pharmacy";
          initialInventoryLevels[product.id] = product.stock || 0;
        });
        setOfferedInShop(initialOfferedState);
        setInventoryLevels(initialInventoryLevels);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading pharmacy products:", error);
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchQuery]);

  // Toggle individual product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Toggle offering product in shop
  const toggleOfferedInShop = (productId: string, productName: string) => {
    const newState = !offeredInShop[productId];
    setOfferedInShop(prev => ({
      ...prev,
      [productId]: newState
    }));
    
    toast.success(
      newState 
        ? `${productName} wird jetzt im Shop angeboten` 
        : `${productName} wird nicht mehr im Shop angeboten`
    );
  };

  // Update inventory level
  const updateInventoryLevel = (productId: string, newLevel: number) => {
    setInventoryLevels(prev => ({
      ...prev,
      [productId]: newLevel
    }));
    
    const product = products.find(p => p.id === productId);
    if (product) {
      toast.success(`Bestand für ${product.name} aktualisiert: ${newLevel} verfügbar`);
    }
  };

  // Handle select all toggle
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    // Update all product selections based on selectAll state
    const updatedSelections = {};
    filteredProducts.forEach(product => {
      updatedSelections[product.id] = newSelectAll;
    });
    
    setSelectedProducts(updatedSelections);
  };

  // Product action handlers
  const handleViewProduct = (product: Product) => {
    toast.info(`Produkt ansehen: ${product.name}`);
    window.open(`/product/${product.id}`, '_blank');
  };

  const handleEditProduct = (product: Product) => {
    toast.info(`Produkt bearbeiten: ${product.name}`);
  };

  const handleDeleteProduct = (product: Product) => {
    toast.warning(`Möchten Sie das Produkt wirklich löschen: ${product.name}?`, {
      action: {
        label: "Löschen",
        onClick: () => {
          toast.success(`Produkt gelöscht: ${product.name}`);
          // Here we would actually delete the product, for now just filter it out
          setProducts(prevProducts => prevProducts.filter(p => p.id !== product.id));
        }
      },
      cancel: {
        label: "Abbrechen",
        onClick: () => {}
      }
    });
  };

  const handleUpdateStock = (product: Product) => {
    const currentLevel = inventoryLevels[product.id] || 0;
    const newLevel = prompt(`Neuen Bestand für ${product.name} eingeben:`, currentLevel.toString());
    
    if (newLevel !== null) {
      const parsedLevel = parseInt(newLevel);
      if (!isNaN(parsedLevel) && parsedLevel >= 0) {
        updateInventoryLevel(product.id, parsedLevel);
      } else {
        toast.error("Bitte geben Sie eine gültige Zahl ein");
      }
    }
  };

  const isAnyProductSelected = Object.values(selectedProducts).some(isSelected => isSelected);

  // Show source label based on product source
  const getSourceLabel = (product: Product): string => {
    if (product.source === "woocommerce") return "WooCommerce";
    if (product.source === "shopify") return "Shopify";
    if (product.source === "pharmacy") return "Apotheke";
    return "Extern";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Produkte durchsuchen..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => toast.info("Filter-Optionen werden geöffnet")}
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => toast.info("Bestand aktualisieren")}
          >
            <ShoppingCart className="h-4 w-4" />
            Bestand
          </Button>
          {isAnyProductSelected && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                const selectedIds = Object.entries(selectedProducts)
                  .filter(([_, isSelected]) => isSelected)
                  .map(([id]) => id);
                
                toast.warning(`${selectedIds.length} Produkte löschen?`, {
                  action: {
                    label: "Löschen",
                    onClick: () => {
                      toast.success(`${selectedIds.length} Produkte gelöscht`);
                      setProducts(prevProducts => 
                        prevProducts.filter(p => !selectedProducts[p.id]));
                      setSelectedProducts({});
                    }
                  },
                  cancel: {
                    label: "Abbrechen",
                    onClick: () => {}
                  }
                });
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Ausgewählte löschen
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <div className="flex items-center">
                    <Switch
                      id="select-all"
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </div>
                </TableHead>
                <TableHead>Produkt</TableHead>
                <TableHead>Kategorie</TableHead>
                <TableHead>Preis</TableHead>
                <TableHead>Bestand</TableHead>
                <TableHead>Quelle</TableHead>
                <TableHead>Im Shop</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    {searchQuery ? "Keine Produkte gefunden für diesen Suchbegriff." : "Keine Produkte vorhanden."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Switch
                        id={`select-${product.id}`}
                        checked={!!selectedProducts[product.id]}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md overflow-hidden bg-muted">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {product.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>{product.price.toFixed(2)} €</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span 
                          className={`font-medium ${inventoryLevels[product.id] <= 5 ? 'text-red-500' : ''}`}
                          onClick={() => handleUpdateStock(product)}
                        >
                          {inventoryLevels[product.id] || 0}
                        </span>
                        {inventoryLevels[product.id] <= 5 && (
                          <Badge variant="outline" className="ml-2 bg-red-100 text-red-800 text-xs">
                            Niedrig
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {getSourceLabel(product)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`offer-${product.id}`}
                          checked={!!offeredInShop[product.id]}
                          onCheckedChange={() => toggleOfferedInShop(product.id, product.name)}
                        />
                        <Label htmlFor={`offer-${product.id}`} className="text-xs">
                          {offeredInShop[product.id] ? (
                            <span className="flex items-center text-green-600">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Angeboten
                            </span>
                          ) : (
                            <span className="flex items-center text-muted-foreground">
                              <XCircle className="h-3 w-3 mr-1" />
                              Nicht angeboten
                            </span>
                          )}
                        </Label>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewProduct(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default PharmacyProductsList;
