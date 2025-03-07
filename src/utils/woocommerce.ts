
import { WooCommerceProduct, WooCommerceConfig } from "@/types/woocommerce";
import { Product } from "@/types/product";

// Default WooCommerce API configuration
let wooConfig: WooCommerceConfig = {
  url: '',
  consumerKey: '',
  consumerSecret: '',
  version: 'wc/v3'
};

/**
 * Configure the WooCommerce API connection
 */
export const configureWooCommerce = (config: WooCommerceConfig) => {
  wooConfig = config;
  // Save to localStorage for persistence
  localStorage.setItem('woocommerce_config', JSON.stringify(config));
  console.log('WooCommerce API configured:', config.url);
  return true;
};

/**
 * Load WooCommerce configuration from localStorage
 */
export const loadWooCommerceConfig = (): WooCommerceConfig | null => {
  const savedConfig = localStorage.getItem('woocommerce_config');
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      wooConfig = config;
      return config;
    } catch (e) {
      console.error('Failed to parse WooCommerce config:', e);
      return null;
    }
  }
  return null;
};

/**
 * Check if WooCommerce is configured
 */
export const isWooCommerceConfigured = (): boolean => {
  return !!(wooConfig.url && wooConfig.consumerKey && wooConfig.consumerSecret);
};

/**
 * Fetch products from WooCommerce API
 */
export const fetchWooCommerceProducts = async (category?: string): Promise<Product[]> => {
  if (!isWooCommerceConfigured()) {
    console.error('WooCommerce is not configured');
    return [];
  }

  try {
    // Create the API URL with authentication
    let url = new URL(`${wooConfig.url}/wp-json/${wooConfig.version}/products`);
    url.searchParams.append('consumer_key', wooConfig.consumerKey);
    url.searchParams.append('consumer_secret', wooConfig.consumerSecret);
    url.searchParams.append('per_page', '100'); // Fetch up to 100 products
    
    // Add category filter if provided
    if (category) {
      url.searchParams.append('category', category);
    }

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const wooProducts: WooCommerceProduct[] = await response.json();
    
    // Convert WooCommerce products to our Product format
    return wooProducts.map(convertWooCommerceProduct);
  } catch (error) {
    console.error('Error fetching WooCommerce products:', error);
    return [];
  }
};

/**
 * Convert a WooCommerce product to our Product format
 */
export const convertWooCommerceProduct = (wooProduct: WooCommerceProduct): Product => {
  // Extract THC and CBD values from meta_data if available
  const thcMeta = wooProduct.meta_data.find(meta => meta.key === 'thc_content');
  const cbdMeta = wooProduct.meta_data.find(meta => meta.key === 'cbd_content');
  const strainMeta = wooProduct.meta_data.find(meta => meta.key === 'strain_type');
  const effectsMeta = wooProduct.meta_data.find(meta => meta.key === 'effects');
  const flavorsMeta = wooProduct.meta_data.find(meta => meta.key === 'flavors');
  
  // Get the first category name
  const category = wooProduct.categories && wooProduct.categories.length > 0 
    ? wooProduct.categories[0].name 
    : 'Uncategorized';

  // Parse effects and flavors arrays
  let effects: string[] = [];
  let flavors: string[] = [];
  
  if (effectsMeta && typeof effectsMeta.value === 'string') {
    try {
      effects = JSON.parse(effectsMeta.value);
    } catch (e) {
      effects = effectsMeta.value.split(',').map(item => item.trim());
    }
  }
  
  if (flavorsMeta && typeof flavorsMeta.value === 'string') {
    try {
      flavors = JSON.parse(flavorsMeta.value);
    } catch (e) {
      flavors = flavorsMeta.value.split(',').map(item => item.trim());
    }
  }

  // Convert to our Product format
  return {
    id: String(wooProduct.id),
    name: wooProduct.name,
    price: parseFloat(wooProduct.price) || 0,
    description: wooProduct.description,
    image: wooProduct.images && wooProduct.images.length > 0 ? wooProduct.images[0].src : '/placeholder.svg',
    images: wooProduct.images.map(img => img.src),
    thc: thcMeta?.value as string || undefined,
    cbd: cbdMeta?.value as string || undefined,
    category: category,
    strain: strainMeta?.value as string || undefined,
    effects: effects,
    flavors: flavors,
    weight: getAttributeValue(wooProduct, 'weight'),
    potency: getAttributeValue(wooProduct, 'potency'),
    lab_tested: hasAttribute(wooProduct, 'lab_tested', 'yes')
  };
};

/**
 * Helper to get attribute value from WooCommerce product
 */
const getAttributeValue = (product: WooCommerceProduct, attributeName: string): string | undefined => {
  const attribute = product.attributes.find(attr => 
    attr.name.toLowerCase() === attributeName.toLowerCase()
  );
  return attribute ? attribute.option : undefined;
};

/**
 * Helper to check if product has a specific attribute value
 */
const hasAttribute = (product: WooCommerceProduct, attributeName: string, value: string): boolean => {
  const attributeValue = getAttributeValue(product, attributeName);
  return attributeValue ? attributeValue.toLowerCase() === value.toLowerCase() : false;
};

/**
 * Get category mapping between WooCommerce and our app
 */
export const getCategoryMapping = (wooCategory: string): string => {
  const mappings: {[key: string]: string} = {
    'flower': 'Flowers',
    'flowers': 'Flowers',
    'cannabis': 'Flowers',
    'cannabis-flower': 'Flowers',
    'blüten': 'Flowers',
    'blueten': 'Flowers',
    'oils': 'Oils',
    'oil': 'Oils',
    'öle': 'Oils',
    'oele': 'Oils',
    'accessories': 'Accessories',
    'zubehör': 'Accessories',
    'zubehoer': 'Accessories',
    'edibles': 'Edibles',
    'edible': 'Edibles',
    'essbar': 'Edibles',
    'topicals': 'Topicals',
    'topical': 'Topicals',
    'vapes': 'Vapes',
    'vape': 'Vapes'
  };
  
  // Try to find a mapping, or return the original if no mapping exists
  const lowerCaseCategory = wooCategory.toLowerCase();
  return mappings[lowerCaseCategory] || wooCategory;
};
