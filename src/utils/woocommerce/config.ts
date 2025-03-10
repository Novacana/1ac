import { WooCommerceConfig } from "@/types/woocommerce";

let wooCommerceConfig: {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
  partnerName?: string;
} | null = null;

/**
 * Configure WooCommerce integration
 * @returns {boolean} true if configuration was successful
 */
export const configureWooCommerce = (config: {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version: string;
  partnerName?: string;
}): boolean => {
  try {
    wooCommerceConfig = config;
    
    // Save to localStorage for persistence
    localStorage.setItem('woocommerceConfig', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Error saving WooCommerce config:', error);
    return false;
  }
};

/**
 * Load WooCommerce configuration from localStorage
 */
export const loadWooCommerceConfig = () => {
  if (wooCommerceConfig) return wooCommerceConfig;
  
  const savedConfig = localStorage.getItem('woocommerceConfig');
  if (savedConfig) {
    try {
      wooCommerceConfig = JSON.parse(savedConfig);
    } catch (e) {
      console.error('Error parsing saved WooCommerce config:', e);
      return null;
    }
  }
  
  return wooCommerceConfig;
};

/**
 * Check if WooCommerce is configured
 */
export const isWooCommerceConfigured = () => {
  const config = loadWooCommerceConfig();
  return !!(config?.url && config?.consumerKey && config?.consumerSecret);
};

/**
 * Get WooCommerce configuration
 */
export const getWooCommerceConfig = () => {
  const config = loadWooCommerceConfig();
  if (!config) {
    throw new Error('WooCommerce is not configured');
  }
  return config;
};
