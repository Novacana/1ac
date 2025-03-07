
import React from "react";

interface DataSourceIndicatorProps {
  dataSource: "woocommerce" | "local" | "combined" | "loading";
}

const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({ dataSource }) => {
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
