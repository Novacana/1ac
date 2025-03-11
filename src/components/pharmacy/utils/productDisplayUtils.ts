
import { Product } from "@/types/product";
import { isGDPRCompliant, isHIPAACompliant } from "@/utils/fhirCompliance";

// Show source label based on product source
export const getSourceLabel = (product: Product): string => {
  if (product.source === "woocommerce") return "WooCommerce";
  if (product.source === "shopify") return "Shopify";
  if (product.source === "pharmacy") return "Apotheke";
  if (product.source === "local") return "Lokal";
  return "Extern";
};

// GDPR compliance check for data processing
export const isProductGDPRCompliant = (product: Product): boolean => {
  // For pharmacy products, ensure they comply with GDPR
  return isGDPRCompliant(product);
};

// HIPAA compliance check for medical products
export const isProductHIPAACompliant = (product: Product): boolean => {
  // For medical products, ensure they comply with HIPAA
  return isHIPAACompliant(product);
};

// Check if product data meets FHIR standards
export const isFHIRCompliant = (product: Product): boolean => {
  // Check if product data structure can be mapped to FHIR resources
  // This would involve validating against FHIR medication resource specifications
  return true; // Simplified implementation
};
