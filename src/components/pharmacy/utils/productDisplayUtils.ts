
import { Product } from "@/types/product";

// Show source label based on product source
export const getSourceLabel = (product: Product): string => {
  if (product.source === "woocommerce") return "WooCommerce";
  if (product.source === "shopify") return "Shopify";
  if (product.source === "pharmacy") return "Apotheke";
  if (product.source === "local") return "Lokal";
  return "Extern";
};

// GDPR compliance check for data processing
export const isGDPRCompliant = (product: Product): boolean => {
  // For pharmacy products, ensure they comply with GDPR
  // This is a placeholder for actual GDPR compliance checking logic
  return true;
};
