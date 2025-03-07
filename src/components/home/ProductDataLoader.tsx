
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { 
  fetchWooCommerceProducts, 
  isWooCommerceConfigured
} from "@/utils/woocommerce";
import { toast } from "sonner";

interface ProductDataLoaderProps {
  selectedCategory: string;
  onProductsLoaded: (products: Product[], source: "woocommerce" | "combined" | "local") => void;
}

const ProductDataLoader: React.FC<ProductDataLoaderProps> = ({ 
  selectedCategory, 
  onProductsLoaded 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedCategory, setLoadedCategory] = useState<string | null>(null);

  useEffect(() => {
    // Only load products if category changes or hasn't been loaded yet
    if (loadedCategory === selectedCategory) return;
    
    const loadProducts = async () => {
      console.log(`Loading products for category: ${selectedCategory}`);
      setIsLoading(true);
      setError(null);
      
      try {
        // Array to hold products from all sources
        let allProducts: Product[] = [];
        let dataSource: "woocommerce" | "combined" | "local" = "local";
        let wooCommerceProductCount = 0;
        
        // Always load local products first
        try {
          const { getProductsByCategory } = await import('@/data/products');
          const localProducts = getProductsByCategory(selectedCategory);
          
          if (localProducts && localProducts.length > 0) {
            console.log(`Loaded ${localProducts.length} local products`);
            
            // Process data directory products
            const processedLocalProducts = localProducts.map(product => {
              // Ensure images is an array and fix paths
              const fixedImages = (product.images || []).map(img => {
                if (img.startsWith("public/")) {
                  return img.replace("public/", "/");
                }
                return img.startsWith("/") ? img : `/${img}`;
              });
              
              // Convert to Product type to ensure compatibility
              return {
                ...product,
                image: fixedImages[0] || "/placeholder.svg", // Add required image property
                images: fixedImages.length > 0 ? fixedImages : ["/placeholder.svg"]
              } as Product;
            });
            
            // Add local products to the combined list
            allProducts = [...processedLocalProducts];
            console.log(`Added ${processedLocalProducts.length} local products to the combined list`);
          } else {
            console.log("No local products found");
          }
        } catch (importError) {
          console.error("Error importing local products:", importError);
        }
        
        // Try to fetch products from WooCommerce if configured
        if (isWooCommerceConfigured()) {
          console.log("WooCommerce is configured, fetching products...");
          
          try {
            const wooProducts = await fetchWooCommerceProducts();
            
            if (wooProducts && wooProducts.length > 0) {
              console.log(`Fetched ${wooProducts.length} products from WooCommerce`);
              
              // Add WooCommerce products to combined list
              allProducts = [...allProducts, ...wooProducts];
              wooCommerceProductCount = wooProducts.length;
              
              // Display toast to indicate WooCommerce integration is active
              toast.success(`Loaded ${wooProducts.length} products from WooCommerce`);
            } else {
              console.log("No products found in WooCommerce");
            }
          } catch (wooError) {
            console.error("Error fetching WooCommerce products:", wooError);
            toast.error("Failed to load WooCommerce products");
          }
        } else {
          console.log("WooCommerce is not configured");
        }
        
        // Determine data source based on product origins
        if (allProducts.length === 0) {
          console.log("No products found from any source");
          dataSource = "local";  // Default to local even if empty
        } else if (wooCommerceProductCount === 0) {
          console.log("Only local products found");
          dataSource = "local";
        } else if (wooCommerceProductCount > 0 && wooCommerceProductCount === allProducts.length) {
          console.log("Only WooCommerce products found");
          dataSource = "woocommerce";
        } else if (wooCommerceProductCount > 0 && wooCommerceProductCount < allProducts.length) {
          console.log("Both local and WooCommerce products found - combined source");
          dataSource = "combined";
        }
        
        console.log(`Final unique product count: ${allProducts.length} (Data source: ${dataSource})`);
        
        // Pass products and data source to parent component
        onProductsLoaded(allProducts, dataSource);
        setLoadedCategory(selectedCategory); // Mark this category as loaded
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        
        // Fallback to empty products array on error
        onProductsLoaded([], "local");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [selectedCategory, onProductsLoaded, loadedCategory]);

  return null; // This is a logic-only component, no UI rendering
};

export default ProductDataLoader;
