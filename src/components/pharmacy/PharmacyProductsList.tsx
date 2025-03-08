
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
  Search, Edit, Trash2, Eye, CheckCircle, XCircle, Filter 
} from "lucide-react";
import { Product } from "@/types/product";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const PharmacyProductsList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});
  const [selectAll, setSelectAll] = useState(false);

  // Load pharmacy products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // This would be replaced with a dedicated pharmacy products API endpoint
        const { loadProductsFromAllSources } = await import("@/hooks/useProductSources");
        const { allProducts } = await loadProductsFromAllSources("All", false);
        
        setProducts(allProducts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading pharmacy products:", error);
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle individual product selection
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
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

  const handleFilter = () => {
    toast.info("Filter-Optionen werden geöffnet");
  };

  const isAnyProductSelected = Object.values(selectedProducts).some(isSelected => isSelected);

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
            onClick={handleFilter}
          >
            <Filter className="h-4 w-4" />
            Filter
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
                <TableHead>Vorrat</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
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
                    <TableCell>{product.weight || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aktiv
                        </Badge>
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
