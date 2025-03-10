import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { toast } from "sonner";

export interface PharmacyProductsState {
  products: Product[];
  filteredProducts: Product[];
  isLoading: boolean;
  selectedProducts: Record<string, boolean>;
  selectAll: boolean;
  offeredInShop: Record<string, boolean>;
  inventoryLevels: Record<string, number>;
  searchQuery: string;
}

export const usePharmacyProducts = () => {
  const [state, setState] = useState<PharmacyProductsState>({
    products: [],
    filteredProducts: [],
    isLoading: true,
    selectedProducts: {},
    selectAll: false,
    offeredInShop: {},
    inventoryLevels: {},
    searchQuery: "",
  });

  // Load pharmacy products from integrations only
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // This would be replaced with a dedicated pharmacy products API endpoint
        const { loadProductsFromAllSources } = await import("@/hooks/useProductSources");
        const { allProducts } = await loadProductsFromAllSources("All", false);
        
        // Only keep products from integrations (WooCommerce, Shopify) or local pharmacy inventory
        const pharmacyProducts = allProducts.filter(product => 
          product.source === "woocommerce" || 
          product.source === "shopify" || 
          product.source === "local" ||
          product.source === "pharmacy"
        );
        
        console.log(`Loaded ${pharmacyProducts.length} pharmacy products`);
        
        // Initialize offered in shop state and inventory levels
        const initialOfferedState: Record<string, boolean> = {};
        const initialInventoryLevels: Record<string, number> = {};
        
        pharmacyProducts.forEach(product => {
          initialOfferedState[product.id] = product.source === "local" || product.source === "pharmacy";
          initialInventoryLevels[product.id] = product.stock || 0;
        });
        
        setState(prev => ({
          ...prev,
          products: pharmacyProducts,
          filteredProducts: pharmacyProducts,
          isLoading: false,
          offeredInShop: initialOfferedState,
          inventoryLevels: initialInventoryLevels
        }));
      } catch (error) {
        console.error("Error loading pharmacy products:", error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadProducts();
  }, []);

  // Filter products based on search query
  useEffect(() => {
    const filtered = state.products.filter(product => 
      product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
    
    setState(prev => ({ ...prev, filteredProducts: filtered }));
  }, [state.products, state.searchQuery]);

  // Toggle individual product selection
  const toggleProductSelection = (productId: string) => {
    setState(prev => ({
      ...prev,
      selectedProducts: {
        ...prev.selectedProducts,
        [productId]: !prev.selectedProducts[productId]
      }
    }));
  };

  // Toggle offering product in shop
  const toggleOfferedInShop = (productId: string, productName: string) => {
    const newState = !state.offeredInShop[productId];
    
    setState(prev => ({
      ...prev,
      offeredInShop: {
        ...prev.offeredInShop,
        [productId]: newState
      }
    }));
    
    toast.success(
      newState 
        ? `${productName} wird jetzt im Shop angeboten` 
        : `${productName} wird nicht mehr im Shop angeboten`
    );
  };

  // Update inventory level
  const updateInventoryLevel = (productId: string, newLevel: number) => {
    setState(prev => ({
      ...prev,
      inventoryLevels: {
        ...prev.inventoryLevels,
        [productId]: newLevel
      }
    }));
    
    const product = state.products.find(p => p.id === productId);
    if (product) {
      toast.success(`Bestand für ${product.name} aktualisiert: ${newLevel} verfügbar`);
    }
  };

  // Handle select all toggle
  const handleSelectAll = () => {
    const newSelectAll = !state.selectAll;
    
    // Update all product selections based on selectAll state
    const updatedSelections: Record<string, boolean> = {};
    state.filteredProducts.forEach(product => {
      updatedSelections[product.id] = newSelectAll;
    });
    
    setState(prev => ({
      ...prev,
      selectAll: newSelectAll,
      selectedProducts: updatedSelections
    }));
  };

  // Update search query
  const setSearchQuery = (query: string) => {
    setState(prev => ({ ...prev, searchQuery: query }));
  };

  // Delete selected products
  const deleteSelectedProducts = () => {
    toast.warning(`${Object.keys(state.selectedProducts).filter(id => state.selectedProducts[id]).length} Produkte löschen?`, {
      action: {
        label: "Löschen",
        onClick: () => {
          toast.success(`${Object.keys(state.selectedProducts).filter(id => state.selectedProducts[id]).length} Produkte gelöscht`);
          setState(prev => ({
            ...prev,
            products: prev.products.filter(p => !prev.selectedProducts[p.id]),
            selectedProducts: {}
          }));
        }
      },
      cancel: {
        label: "Abbrechen",
        onClick: () => {}
      }
    });
  };

  // Delete a single product
  const deleteProduct = (product: Product) => {
    toast.warning(`Möchten Sie das Produkt wirklich löschen: ${product.name}?`, {
      action: {
        label: "Löschen",
        onClick: () => {
          toast.success(`Produkt gelöscht: ${product.name}`);
          setState(prev => ({
            ...prev,
            products: prev.products.filter(p => p.id !== product.id)
          }));
        }
      },
      cancel: {
        label: "Abbrechen",
        onClick: () => {}
      }
    });
  };

  // Update product stock
  const handleUpdateStock = (product: Product) => {
    const currentLevel = state.inventoryLevels[product.id] || 0;
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

  return {
    ...state,
    isAnyProductSelected: Object.values(state.selectedProducts).some(isSelected => isSelected),
    toggleProductSelection,
    toggleOfferedInShop,
    handleSelectAll,
    setSearchQuery,
    deleteSelectedProducts,
    deleteProduct,
    handleUpdateStock
  };
};
