
import React from "react";
import { Product } from "@/types/product";
import { usePharmacyProductLoader } from "@/hooks/usePharmacyProductLoader";
import { DataSource } from "@/hooks/useProductSources";

interface PharmacyProductDataLoaderProps {
  onProductsLoaded: (products: Product[], source: DataSource) => void;
}

/**
 * Component that handles loading pharmacy product data
 * This is a presentational wrapper around the usePharmacyProductLoader hook
 */
const PharmacyProductDataLoader: React.FC<PharmacyProductDataLoaderProps> = ({ 
  onProductsLoaded 
}) => {
  // Use the custom hook to load pharmacy products
  const { error } = usePharmacyProductLoader({
    onProductsLoaded
  });

  // Log errors but don't display them (handled by parent components)
  if (error) {
    console.error("Pharmacy product loading error:", error);
  }

  // This is a logic-only component, no UI rendering
  return null;
};

export default PharmacyProductDataLoader;
