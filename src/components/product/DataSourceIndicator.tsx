
import React from "react";

interface DataSourceIndicatorProps {
  dataSource: "woocommerce" | "local" | "loading";
}

const DataSourceIndicator: React.FC<DataSourceIndicatorProps> = ({ dataSource }) => {
  if (dataSource === "loading") return null;
  
  return (
    <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
      Quelle: {dataSource === "woocommerce" ? "WooCommerce" : "Lokale Daten"}
    </div>
  );
};

export default DataSourceIndicator;
