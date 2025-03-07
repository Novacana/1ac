
import { Product } from "@/types/product";
import { 
  fetchWooCommerceProducts, 
  isWooCommerceConfigured 
} from "@/utils/woocommerce";
import { convertLocalProducts } from "@/utils/product-image-utils";
import { toast } from "sonner";

export type DataSource = "woocommerce" | "combined" | "local";

/**
 * Load products from all available sources (local and WooCommerce)
 */
export const loadProductsFromAllSources = async (
  selectedCategory: string, 
  alreadyLoaded: boolean
): Promise<{
  allProducts: Product[];
  dataSource: DataSource;
}> => {
  // Array to hold products from all sources
  let allProducts: Product[] = [];
  let dataSource: DataSource = "local";
  let wooCommerceProductCount = 0;
  
  // Always load local products first
  try {
    // Import directly to ensure we get the latest data
    const productsModule = await import('@/data/products');
    
    // Use the helper function to get products by category or all products
    const dataProducts = productsModule.getProductsByCategory(selectedCategory);
    
    if (dataProducts && dataProducts.length > 0) {
      console.log(`Loaded ${dataProducts.length} local products for category "${selectedCategory}"`);
      
      // Process data directory products using the utility function
      const processedDataProducts = convertLocalProducts(dataProducts);
      
      // Add local products to the combined list
      allProducts = [...processedDataProducts];
      dataSource = "local";
    } else {
      console.log(`No local products found for category "${selectedCategory}"`);
    }
  } catch (importError) {
    console.error("Error importing local products:", importError);
  }
  
  // Try to fetch products from WooCommerce if configured
  if (isWooCommerceConfigured()) {
    console.log("Fetching products from WooCommerce integration");
    
    try {
      const wooProducts = await fetchWooCommerceProducts();
      
      if (wooProducts && wooProducts.length > 0) {
        console.log(`Fetched ${wooProducts.length} products from WooCommerce`);
        
        // Add WooCommerce products to combined list
        allProducts = [...allProducts, ...wooProducts];
        wooCommerceProductCount = wooProducts.length;
        
        // Update data source indicator
        if (dataSource === "local" && wooCommerceProductCount > 0) {
          dataSource = "combined";
        } else if (allProducts.length === wooCommerceProductCount) {
          dataSource = "woocommerce";
        }
        
        // Show toast notification on successful load
        if (!alreadyLoaded) {
          toast.success(`Loaded ${wooProducts.length} products from WooCommerce`);
        }
      } else {
        console.log("No products found in WooCommerce");
      }
    } catch (wooError) {
      console.error("Error fetching WooCommerce products:", wooError);
      if (!alreadyLoaded) {
        toast.error("Failed to load WooCommerce products");
      }
    }
  } else {
    console.log("WooCommerce is not configured");
  }
  
  return { allProducts, dataSource };
};
