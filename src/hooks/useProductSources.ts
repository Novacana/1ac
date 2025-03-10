import { Product } from "@/types/product";
import { 
  fetchWooCommerceProducts, 
  isWooCommerceConfigured,
  getWooCommerceConfig 
} from "@/utils/woocommerce";
import {
  fetchShopifyProducts,
  isShopifyConfigured,
  getShopifyConfig
} from "@/utils/shopify";
import { convertLocalProducts } from "@/utils/product-image-utils";
import { toast } from "sonner";

export type DataSource = "woocommerce" | "shopify" | "combined" | "local";

// Store the timestamp of the last notification to avoid repeated messages
let lastNotificationTime: number = 0;
const NOTIFICATION_COOLDOWN = 30000; // 30 seconds cooldown

/**
 * Load products from all available sources (local, WooCommerce, and Shopify)
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
  let shopifyProductCount = 0;
  
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
      
      // Add source information to each product
      const localProductsWithSource = processedDataProducts.map(product => ({
        ...product,
        source: "local" as const
      }));
      
      // Add local products to the combined list
      allProducts = [...localProductsWithSource];
      dataSource = "local";
    } else {
      console.log(`No local products found for category "${selectedCategory}"`);
    }
  } catch (importError) {
    console.error("Error importing local products:", importError);
  }
  
  // Get current time to check notification throttling
  const currentTime = Date.now();
  const shouldShowNotification = !alreadyLoaded || (currentTime - lastNotificationTime > NOTIFICATION_COOLDOWN);
  
  // Try to fetch products from WooCommerce if configured
  if (isWooCommerceConfigured()) {
    console.log("Fetching products from WooCommerce integration");
    
    try {
      const wooConfig = getWooCommerceConfig();
      const partnerName = wooConfig.partnerName || "Partner";
      const wooProducts = await fetchWooCommerceProducts();
      
      if (wooProducts && wooProducts.length > 0) {
        console.log(`Fetched ${wooProducts.length} products from ${partnerName} (WooCommerce)`);
        
        // Add source information to each product
        const wooProductsWithSource = wooProducts.map(product => ({
          ...product,
          source: "woocommerce" as const
        }));
        
        // Add WooCommerce products to combined list
        allProducts = [...allProducts, ...wooProductsWithSource];
        wooCommerceProductCount = wooProducts.length;
        
        // Update data source indicator
        dataSource = updateDataSource(dataSource, "woocommerce", allProducts.length, wooCommerceProductCount);
        
        // Show toast notification on successful load with partner name, but not too frequently
        if (shouldShowNotification) {
          toast.success(`${wooProducts.length} Produkte von ${partnerName} geladen`);
          lastNotificationTime = currentTime;
        }
      } else {
        console.log(`No products found from ${partnerName} (WooCommerce)`);
      }
    } catch (wooError) {
      console.error("Error fetching WooCommerce products:", wooError);
      if (shouldShowNotification) {
        toast.error("Fehler beim Laden der Partner-Produkte");
        lastNotificationTime = currentTime;
      }
    }
  } else {
    console.log("WooCommerce is not configured");
  }
  
  // Try to fetch products from Shopify if configured
  if (isShopifyConfigured()) {
    console.log("Fetching products from Shopify integration");
    
    try {
      const shopifyConfig = getShopifyConfig();
      const partnerName = shopifyConfig.partnerName || "Partner";
      const shopifyProducts = await fetchShopifyProducts();
      
      if (shopifyProducts && shopifyProducts.length > 0) {
        console.log(`Fetched ${shopifyProducts.length} products from ${partnerName} (Shopify)`);
        
        // Add source information to each product
        const shopifyProductsWithSource = shopifyProducts.map(product => ({
          ...product,
          source: "shopify" as const
        }));
        
        // Add Shopify products to combined list
        allProducts = [...allProducts, ...shopifyProductsWithSource];
        shopifyProductCount = shopifyProducts.length;
        
        // Update data source indicator
        dataSource = updateDataSource(dataSource, "shopify", allProducts.length, shopifyProductCount);
        
        // Show toast notification on successful load but not too frequently
        if (shouldShowNotification && (currentTime - lastNotificationTime > NOTIFICATION_COOLDOWN)) {
          toast.success(`${shopifyProducts.length} Produkte von ${partnerName} geladen`);
          lastNotificationTime = currentTime;
        }
      } else {
        console.log(`No products found from ${partnerName} (Shopify)`);
      }
    } catch (shopifyError) {
      console.error("Error fetching Shopify products:", shopifyError);
      if (shouldShowNotification && (currentTime - lastNotificationTime > NOTIFICATION_COOLDOWN)) {
        toast.error("Fehler beim Laden der Partner-Produkte");
        lastNotificationTime = currentTime;
      }
    }
  } else {
    console.log("Shopify is not configured");
  }
  
  return { allProducts, dataSource };
};

/**
 * Helper function to update the data source indicator
 */
const updateDataSource = (
  currentDataSource: DataSource, 
  newSource: "woocommerce" | "shopify", 
  totalProductCount: number,
  newSourceProductCount: number
): DataSource => {
  if (currentDataSource === "local") {
    // If we only had local products before, check if we now have new source products
    if (newSourceProductCount > 0) {
      // If we also have local products, it's a combined source
      return newSourceProductCount < totalProductCount ? "combined" : newSource;
    }
    // If no new source products, keep as local
    return "local";
  } else if (currentDataSource === newSource) {
    // If already using this source, keep it
    return newSource;
  } else if (currentDataSource === "combined") {
    // Already combined, stay combined
    return "combined";
  } else {
    // Different source already set, now we're combining
    return "combined";
  }
};
