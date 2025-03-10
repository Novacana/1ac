import { ShopifyConfig } from "@/types/shopify";

let shopifyConfig: {
  shopUrl: string;
  accessToken: string;
  apiVersion: string;
  partnerName?: string;
} | null = null;

/**
 * Configure Shopify integration
 */
export const configureShopify = (config: {
  shopUrl: string;
  accessToken: string;
  apiVersion: string;
  partnerName?: string;
}) => {
  shopifyConfig = config;
  
  // Save to localStorage for persistence
  localStorage.setItem('shopifyConfig', JSON.stringify(config));
};

/**
 * Load Shopify configuration from localStorage
 */
export const loadShopifyConfig = () => {
  if (shopifyConfig) return shopifyConfig;
  
  const savedConfig = localStorage.getItem('shopifyConfig');
  if (savedConfig) {
    try {
      shopifyConfig = JSON.parse(savedConfig);
    } catch (e) {
      console.error('Error parsing saved Shopify config:', e);
      return null;
    }
  }
  
  return shopifyConfig;
};

/**
 * Check if Shopify is configured
 */
export const isShopifyConfigured = () => {
  const config = loadShopifyConfig();
  return !!(config?.shopUrl && config?.accessToken);
};

/**
 * Get Shopify configuration
 */
export const getShopifyConfig = () => {
  const config = loadShopifyConfig();
  if (!config) {
    throw new Error('Shopify is not configured');
  }
  return config;
};
