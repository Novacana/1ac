
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

    console.log('Fetching WooCommerce products from:', url.toString().replace(/consumer_secret=([^&]+)/, 'consumer_secret=****'));
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const wooProducts: WooCommerceProduct[] = await response.json();
    console.log(`Fetched ${wooProducts.length} WooCommerce products`);
    
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
  
  // Get category name using the enhanced mapping system
  let bestCategory = 'Uncategorized';
  
  if (wooProduct.categories && wooProduct.categories.length > 0) {
    // First try to match exactly, then try to find the best match
    for (const cat of wooProduct.categories) {
      const mappedCategory = getCategoryMapping(cat.name);
      if (mappedCategory !== cat.name) {
        // Found a direct mapping
        bestCategory = mappedCategory;
        break;
      }
      
      // Look for keyword matches if no direct mapping
      const keywords = getBestCategoryMatch(cat.name);
      if (keywords) {
        bestCategory = keywords;
        break;
      }
    }
    
    // If no match found, use the first category
    if (bestCategory === 'Uncategorized' && wooProduct.categories[0].name) {
      bestCategory = wooProduct.categories[0].name;
    }
  }

  console.log(`Mapped WooCommerce product [${wooProduct.name}] category to: ${bestCategory}`);

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
    category: bestCategory,
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
    // Flowers category mappings
    'flower': 'Flowers',
    'flowers': 'Flowers',
    'cannabis': 'Flowers',
    'cannabis-flower': 'Flowers',
    'blüten': 'Flowers',
    'blueten': 'Flowers',
    'blumen': 'Flowers',
    'hemp flower': 'Flowers',
    'hemp flowers': 'Flowers',
    'hanfblüten': 'Flowers',
    'hanfblueten': 'Flowers',
    'cbd flower': 'Flowers',
    'cbd blüten': 'Flowers',
    'cannabis blüten': 'Flowers',
    
    // Oils category mappings
    'oils': 'Oils',
    'oil': 'Oils',
    'öle': 'Oils',
    'oele': 'Oils',
    'cbd oil': 'Oils',
    'cbd öl': 'Oils',
    'cbd-öl': 'Oils',
    'hanföl': 'Oils',
    'cannabis oil': 'Oils',
    'cannabis-oil': 'Oils',
    'tincture': 'Oils',
    'tinkturen': 'Oils',
    'drops': 'Oils',
    'tropfen': 'Oils',
    
    // Accessories category mappings
    'accessories': 'Accessories',
    'zubehör': 'Accessories',
    'zubehoer': 'Accessories',
    'equipment': 'Accessories',
    'geräte': 'Accessories',
    'devices': 'Accessories',
    'tools': 'Accessories',
    'smoking accessories': 'Accessories',
    'vaping accessories': 'Accessories',
    
    // Edibles category mappings
    'edibles': 'Edibles',
    'edible': 'Edibles',
    'essbar': 'Edibles',
    'essbare': 'Edibles',
    'lebensmittel': 'Edibles',
    'food': 'Edibles',
    'snacks': 'Edibles',
    'gummies': 'Edibles',
    'gummis': 'Edibles',
    'candies': 'Edibles',
    'süßigkeiten': 'Edibles',
    'chocolate': 'Edibles',
    'schokolade': 'Edibles',
    'drinks': 'Edibles',
    'getränke': 'Edibles',
    
    // Topicals category mappings
    'topicals': 'Topicals',
    'topical': 'Topicals',
    'cream': 'Topicals',
    'creme': 'Topicals',
    'salve': 'Topicals',
    'salbe': 'Topicals',
    'lotion': 'Topicals',
    'lotionen': 'Topicals',
    'balm': 'Topicals',
    'balsam': 'Topicals',
    'massage': 'Topicals',
    'skin': 'Topicals',
    'haut': 'Topicals',
    
    // Vapes category mappings
    'vapes': 'Vapes',
    'vape': 'Vapes',
    'vaporizer': 'Vapes',
    'vaporizers': 'Vapes',
    'vaporisator': 'Vapes',
    'vaporisatoren': 'Vapes',
    'cartridges': 'Vapes',
    'cart': 'Vapes',
    'carts': 'Vapes',
    'kartuschen': 'Vapes',
    'e-liquid': 'Vapes',
    'eliquid': 'Vapes',
    'liquid': 'Vapes'
  };
  
  // Try to find a mapping, or return the original if no mapping exists
  const lowerCaseCategory = wooCategory.toLowerCase();
  return mappings[lowerCaseCategory] || wooCategory;
};

/**
 * Try to find the best category match based on keywords in the category name
 */
export const getBestCategoryMatch = (categoryName: string): string | null => {
  const lowerCaseName = categoryName.toLowerCase();
  
  // Define keywords for each category
  const categoryKeywords: {[key: string]: string[]} = {
    'Flowers': ['flower', 'blüte', 'bluete', 'blumen', 'cannabis', 'hemp', 'hanf', 'cbd flower', 'buds', 'knospen'],
    'Oils': ['oil', 'öl', 'oel', 'tincture', 'tinktur', 'extract', 'extrakt', 'drops', 'tropfen'],
    'Edibles': ['edible', 'food', 'essen', 'gummy', 'gummies', 'chocolate', 'candy', 'drink', 'getränk'],
    'Topicals': ['topical', 'cream', 'creme', 'balm', 'salve', 'salbe', 'lotion', 'skin', 'haut'],
    'Vapes': ['vape', 'vapor', 'vaporizer', 'cartridge', 'cart', 'liquid', 'e-liquid'],
    'Accessories': ['accessory', 'zubehör', 'device', 'tool', 'equipment', 'grinder', 'pipe', 'bong']
  };
  
  // Check each category's keywords
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (lowerCaseName.includes(keyword)) {
        return category;
      }
    }
  }
  
  return null;
};
