
import { Product } from "@/types/product";
import { isWooCommerceConfigured, getWooCommerceConfig } from "./config";

/**
 * Fetch products from WooCommerce API
 * For demonstration purposes, we're using mock products
 */
export const fetchWooCommerceProducts = async (category?: string): Promise<Product[]> => {
  // Check if WooCommerce is configured
  if (!isWooCommerceConfigured()) {
    console.log('WooCommerce is not configured, returning empty product list');
    return [];
  }

  try {
    console.log('Fetching mock WooCommerce products...');
    // Generate and return mock WooCommerce products
    const mockProducts = getMockWooCommerceProducts();
    console.log(`Generated ${mockProducts.length} mock WooCommerce products`);
    return mockProducts;
  } catch (error) {
    // Handle any errors that might occur
    console.error('Error generating mock WooCommerce products:', error);
    return [];
  }
};

// Helper function to generate mock WooCommerce products
function getMockWooCommerceProducts(): Product[] {
  console.log('Generating mock WooCommerce products');
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
