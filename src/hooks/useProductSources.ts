
import { Product } from "@/types/product";
import { 
  fetchWooCommerceProducts, 
  isWooCommerceConfigured 
} from "@/utils/woocommerce";
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
      allProducts = [...processedDataProducts];
      dataSource = "local";
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
