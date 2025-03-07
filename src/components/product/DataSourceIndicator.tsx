
import React, { useEffect, useRef } from "react";
import { toast } from "sonner";

interface DataSourceIndicatorProps {
  dataSource: "woocommerce" | "local" | "combined" | "loading";
  productCount?: number;
}

const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({ 
  dataSource, 
  productCount = 0 
}) => {
  const previousSource = useRef<string>(dataSource);
  const toastShown = useRef<boolean>(false);
  
  useEffect(() => {
    // Only show toast when source changes and not on initial load
    if (dataSource !== previousSource.current && dataSource !== "loading" && !toastShown.current) {
      if (dataSource === "woocommerce" && productCount > 0) {
        toast.success(`Loaded ${productCount} products from WooCommerce`, {
          id: "woocommerce-load-success", // Using an ID prevents duplicate toasts
          duration: 3000,
        });
        toastShown.current = true;
      }
      previousSource.current = dataSource;
    }
  }, [dataSource, productCount]);
  
  if (dataSource === "loading") return null;
  
  let sourceText = "Lokale Daten";
  let bgClass = "bg-muted";
  
  switch (dataSource) {
    case "woocommerce":
      sourceText = "WooCommerce";
      bgClass = "bg-green-100 text-green-800";
      break;
    case "combined":
      sourceText = "Kombinierte Daten";
      bgClass = "bg-blue-100 text-blue-800";
      break;
    case "local":
    default:
      sourceText = "Lokale Daten";
      bgClass = "bg-muted";
  }
  
  return (
    <div className={`text-xs px-2 py-1 rounded ${bgClass}`}>
      Quelle: {sourceText}
    </div>
  );
};

export default DataSourceIndicator;
