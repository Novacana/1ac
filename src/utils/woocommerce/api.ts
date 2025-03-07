
import { WooCommerceProduct } from "@/types/woocommerce";
import { Product } from "@/types/product";
import { isWooCommerceConfigured, getWooCommerceConfig } from "./config";
import { convertWooCommerceProduct } from "./product-converter";

/**
 * Fetch products from WooCommerce API
 */
export const fetchWooCommerceProducts = async (category?: string): Promise<Product[]> => {
  if (!isWooCommerceConfigured()) {
    console.error('WooCommerce is not configured');
    return [];
  }

  try {
    const wooConfig = getWooCommerceConfig();
    
    // Create the API URL with authentication
    let url = new URL(`${wooConfig.url}/wp-json/${wooConfig.version}/products`);
    url.searchParams.append('consumer_key', wooConfig.consumerKey);
    url.searchParams.append('consumer_secret', wooConfig.consumerSecret);
    url.searchParams.append('per_page', '100'); // Fetch up to 100 products
    
    // Add category filter if provided
    if (category) {
      url.searchParams.append('category', category);
    }

    console.log('Fetching WooCommerce products from:', url.toString().replace(/consumer_secret=([^&]+)/, 'consumer_secret=****'));
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`WooCommerce API error (${response.status}):`, errorText);
      throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
    }
    
    const wooProducts: WooCommerceProduct[] = await response.json();
    console.log(`Fetched ${wooProducts.length} WooCommerce products successfully`);
    
    // Convert WooCommerce products to our Product format
    return wooProducts.map(convertWooCommerceProduct);
  } catch (error) {
    console.error('Error fetching WooCommerce products:', error);
    throw error; // Re-throw to handle in the component
  }
};
