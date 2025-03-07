
import React from "react";

interface ProductUsageProps {
  use?: string;
}

const ProductUsage: React.FC<ProductUsageProps> = ({ use }) => {
  if (!use) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Anwendung</h3>
      <p className="text-sm text-foreground/80">{use}</p>
    </div>
  );
};

export default ProductUsage;
