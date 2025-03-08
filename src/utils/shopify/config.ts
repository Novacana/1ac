
import { ShopifyConfig } from "@/types/shopify";

// Default Shopify API configuration
let shopifyConfig: ShopifyConfig = {
  shopUrl: '',
  accessToken: '',
  apiVersion: '2023-10'
};

/**
 * Configure the Shopify API connection
 */
export const configureShopify = (config: ShopifyConfig) => {
  shopifyConfig = config;
  // Save to localStorage for persistence
  localStorage.setItem('shopify_config', JSON.stringify(config));
  console.log('Shopify API configured:', config.shopUrl);
  return true;
};

/**
 * Load Shopify configuration from localStorage
 */
export const loadShopifyConfig = (): ShopifyConfig | null => {
  const savedConfig = localStorage.getItem('shopify_config');
  if (savedConfig) {
    try {
      const config = JSON.parse(savedConfig);
      shopifyConfig = config;
      return config;
    } catch (e) {
      console.error('Failed to parse Shopify config:', e);
      return null;
    }
  }
  return null;
};

/**
 * Check if Shopify is configured
 */
export const isShopifyConfigured = (): boolean => {
  // Load config from localStorage if not already loaded
  if (!shopifyConfig.shopUrl) {
    loadShopifyConfig();
  }
  
  return !!(shopifyConfig.shopUrl && shopifyConfig.accessToken);
};

/**
 * Get the current Shopify configuration
 */
export const getShopifyConfig = (): ShopifyConfig => {
  return shopifyConfig;
};
