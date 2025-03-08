
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { DataSource } from "@/hooks/useProductSources";
import { toast } from "sonner";

interface UsePharmacyProductLoaderProps {
  onProductsLoaded: (products: Product[], source: DataSource) => void;
}

interface UsePharmacyProductLoaderResult {
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to load pharmacy products
 */
export const usePharmacyProductLoader = ({
  onProductsLoaded
}: UsePharmacyProductLoaderProps): UsePharmacyProductLoaderResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    // Avoid duplicate loads
    if (loadedRef.current) {
      return;
    }

    const loadPharmacyProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // TODO: Replace this with actual pharmacy API integration
        // This is a placeholder that uses the WooCommerce API for demo purposes
        
        // In a real implementation, this would connect to pharmacy management systems
        // like APOSOFT, Lauer-Fischer WINAPO, Awinta, etc.
        const { fetchWooCommerceProducts } = await import("@/utils/woocommerce");
        let pharmacyProducts: Product[] = [];
        
        try {
          // Attempt to fetch from WooCommerce as a demo
          pharmacyProducts = await fetchWooCommerceProducts();
          
          // Tag them as pharmacy products (in a real implementation, these would come 
          // directly from pharmacy systems)
          pharmacyProducts = pharmacyProducts.map(product => ({
            ...product,
            product_type: 'pharmacy'
          }));
          
          console.log(`Loaded ${pharmacyProducts.length} pharmacy products`);
        } catch (pharmErr) {
          console.error("Error fetching pharmacy products:", pharmErr);
          toast.error("Fehler beim Laden der Apothekenprodukte");
        }
        
        // Mark as loaded
        loadedRef.current = true;
        
        // Pass the pharmacy products to parent component
        onProductsLoaded(pharmacyProducts, "woocommerce");
      } catch (err) {
        console.error("Error in pharmacy product loader:", err);
        setError(err instanceof Error ? err.message : "Failed to load pharmacy products");
        
        // Fallback to empty products array on error
        onProductsLoaded([], "local");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPharmacyProducts();
  }, [onProductsLoaded]);

  return { isLoading, error };
};
