
import { ShopifyProduct } from "@/types/shopify";
import { Product } from "@/types/product";
import { isShopifyConfigured, getShopifyConfig } from "./config";
import { convertShopifyProduct } from "./product-converter";

/**
 * Fetch products from Shopify API
 */
export const fetchShopifyProducts = async (category?: string): Promise<Product[]> => {
  if (!isShopifyConfigured()) {
    console.error('Shopify is not configured');
    return [];
  }

  try {
    const shopifyConfig = getShopifyConfig();
    
    // Create the API URL with authentication
    let url = new URL(`https://${shopifyConfig.shopUrl}/admin/api/${shopifyConfig.apiVersion}/products.json`);
    
    // Add category filter if provided (in Shopify, this would be done with collection or tag filtering)
    if (category) {
      url.searchParams.append('collection_id', category);
    }

    console.log('Fetching Shopify products from:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopifyConfig.accessToken
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Shopify API error (${response.status}):`, errorText);
      throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
    }
    
    const data = await response.json();
    const shopifyProducts: ShopifyProduct[] = data.products;
    console.log(`Fetched ${shopifyProducts.length} Shopify products successfully`);
    
    // Convert Shopify products to our Product format
    return shopifyProducts.map(convertShopifyProduct);
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error; // Re-throw to handle in the component
  }
};
