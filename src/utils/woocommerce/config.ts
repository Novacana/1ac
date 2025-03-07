import { WooCommerceConfig } from "@/types/woocommerce";

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
 * For testing purposes, we'll hard-code this to return true
 */
export const isWooCommerceConfigured = (): boolean => {
  // For testing purposes to force showing combined product sources
  // In production, this should check for actual configuration
  return true;
};

/**
 * Get the current WooCommerce configuration
 */
export const getWooCommerceConfig = (): WooCommerceConfig => {
  return wooConfig;
};
