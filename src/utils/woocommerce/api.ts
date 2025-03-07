import { WooCommerceProduct } from "@/types/woocommerce";
import { Product } from "@/types/product";
import { isWooCommerceConfigured, getWooCommerceConfig } from "./config";
import { convertWooCommerceProduct } from "./product-converter";

/**
 * Fetch products from WooCommerce API
 * For demonstration purposes, we'll return mock products
 */
export const fetchWooCommerceProducts = async (category?: string): Promise<Product[]> => {
  if (!isWooCommerceConfigured()) {
    console.error('WooCommerce is not configured');
    return [];
  }

  // For testing purposes - return mock WooCommerce products
  // In production, this would fetch from the actual WooCommerce API
  return getMockWooCommerceProducts();
};

// Helper function to generate mock WooCommerce products
function getMockWooCommerceProducts(): Product[] {
  return [
    {
      id: 'woo-1',
      name: 'WooCommerce OG Kush',
      price: 12.99,
      image: '/lovable-uploads/51f7c998-91ad-4cf3-ba40-81d2f23bbddc.png',
      description: 'Premium OG Kush from our WooCommerce store',
      thc: '22%',
      cbd: '1%',
      category: 'Blüten',
      strain: 'Hybrid'
    },
    {
      id: 'woo-2',
      name: 'WooCommerce CBD Öl',
      price: 39.99,
      image: '/lovable-uploads/8db2393e-a67f-435f-9eb7-467e1a367470.png',
      description: 'High quality CBD oil, available only from our WooCommerce store',
      thc: '<0.2%',
      cbd: '15%',
      category: 'Öle',
    },
    {
      id: 'woo-3',
      name: 'WooCommerce Sour Diesel',
      price: 13.50,
      image: '/lovable-uploads/2e4972d1-cad4-4080-8445-33fcfdee5f57.png',
      description: 'Energizing Sour Diesel from WooCommerce',
      thc: '24%',
      cbd: '0.1%',
      category: 'Blüten',
      strain: 'Sativa'
    }
  ];
}

/**
 * Fetch products from WooCommerce API
 */
// export const fetchWooCommerceProducts = async (category?: string): Promise<Product[]> => {
//   if (!isWooCommerceConfigured()) {
//     console.error('WooCommerce is not configured');
//     return [];
//   }

//   try {
//     const wooConfig = getWooCommerceConfig();
    
//     // Create the API URL with authentication
//     let url = new URL(`${wooConfig.url}/wp-json/${wooConfig.version}/products`);
//     url.searchParams.append('consumer_key', wooConfig.consumerKey);
//     url.searchParams.append('consumer_secret', wooConfig.consumerSecret);
//     url.searchParams.append('per_page', '100'); // Fetch up to 100 products
    
//     // Add category filter if provided
//     if (category) {
//       url.searchParams.append('category', category);
//     }

//     console.log('Fetching WooCommerce products from:', url.toString().replace(/consumer_secret=([^&]+)/, 'consumer_secret=****'));
    
//     const response = await fetch(url.toString(), {
//       method: 'GET',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     });
    
//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error(`WooCommerce API error (${response.status}):`, errorText);
//       throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
//     }
    
//     const wooProducts: WooCommerceProduct[] = await response.json();
//     console.log(`Fetched ${wooProducts.length} WooCommerce products successfully`);
    
//     // Convert WooCommerce products to our Product format
//     return wooProducts.map(convertWooCommerceProduct);
//   } catch (error) {
//     console.error('Error fetching WooCommerce products:', error);
//     throw error; // Re-throw to handle in the component
//   }
// };
