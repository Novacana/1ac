
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { 
  fetchWooCommerceProducts, 
  isWooCommerceConfigured, 
  getCategoryMapping,
  getBestCategoryMatch
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
  const isLoadingRef = useRef(false);
  const lastCategoryRef = useRef<string>(selectedCategory);

  useEffect(() => {
    // Only load products if category changes or first load
    if (lastCategoryRef.current === selectedCategory && !isLoading) {
      return;
    }

    // Prevent concurrent requests
    if (isLoadingRef.current) {
      return;
    }

    lastCategoryRef.current = selectedCategory;
    
    const loadProducts = async () => {
      // Set loading ref to prevent concurrent requests
      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);
      
      try {
        // Array to hold products from all sources
        let allProducts: Product[] = [];
        let dataSource: "woocommerce" | "combined" | "local" = "local";
        let wooCommerceProductCount = 0;
        
        // Try to fetch products from WooCommerce first if configured
        if (isWooCommerceConfigured()) {
          console.log("Fetching products from WooCommerce integration");
          
          try {
            const wooProducts = await fetchWooCommerceProducts();
            
            if (wooProducts && wooProducts.length > 0) {
              console.log(`Fetched ${wooProducts.length} products from WooCommerce`);
              
              // Add WooCommerce products to combined list
              allProducts = [...wooProducts];
              wooCommerceProductCount = wooProducts.length;
              dataSource = "woocommerce";
            } else {
              console.log("No products found in WooCommerce");
            }
          } catch (wooError) {
            console.error("Error fetching WooCommerce products:", wooError);
            toast.error("Failed to load WooCommerce products", {
              id: "woocommerce-load-error",
              duration: 3000,
            });
          }
        } else {
          console.log("WooCommerce is not configured");
        }
        
        // Always load local products to combine or as fallback
        try {
          const { getProductsByCategory } = await import('@/data/products');
          const dataProducts = getProductsByCategory(selectedCategory);
          
          if (dataProducts && dataProducts.length > 0) {
            console.log(`Loaded ${dataProducts.length} local products`);
            
            // Process data directory products
            const processedDataProducts = dataProducts.map(product => {
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
            allProducts = [...allProducts, ...processedDataProducts];
            
            // Update data source indicator
            if (dataSource === "woocommerce" && allProducts.length > wooCommerceProductCount) {
              dataSource = "combined";
            } else if (dataSource === "local" && allProducts.length > 0) {
              dataSource = "local";
            }
          }
        } catch (importError) {
          console.error("Error importing local products:", importError);
        }
        
        // Filter combined products by selected category
        let filteredProducts = allProducts;
        
        if (selectedCategory !== "All") {
          filteredProducts = allProducts.filter(product => {
            const productCategory = product.category;
            const normalizedCategory = selectedCategory;
            
            // Match exact category name
            if (productCategory === normalizedCategory) {
              return true;
            }
            
            // Check if the product category maps to the selected category
            if (getCategoryMapping(productCategory) === normalizedCategory) {
              return true;
            }
            
            // Try to match by keywords if exact match fails
            if (getBestCategoryMatch(productCategory) === normalizedCategory) {
              return true;
            }
            
            return false;
          });
        }
        
        console.log(`Combined and filtered to ${filteredProducts.length} products for category ${selectedCategory}`);
        
        // Remove potential duplicates (by ID)
        const uniqueProducts = Array.from(
          new Map(filteredProducts.map(item => [item.id, item])).values()
        );
        
        console.log(`Final unique product count: ${uniqueProducts.length} (Data source: ${dataSource})`);
        
        // Pass the filtered products and data source to parent component
        onProductsLoaded(uniqueProducts, dataSource);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        
        // Fallback to empty products array on error
        onProductsLoaded([], "local");
      } finally {
        setIsLoading(false);
        // Reset loading ref to allow future requests
        isLoadingRef.current = false;
      }
    };
    
    loadProducts();
  }, [selectedCategory, onProductsLoaded, isLoading]);

  if (error) {
    console.error("Product loading error:", error);
  }

  return null; // This is a logic-only component, no UI rendering
};

export default ProductDataLoader;
