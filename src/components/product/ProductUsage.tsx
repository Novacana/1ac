
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductUsageProps {
  use?: string;
}

const ProductUsage: React.FC<ProductUsageProps> = ({ use }) => {
  const { t } = useLanguage();

  if (!use) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{t("how_to_use")}</h3>
      <p className="text-sm text-foreground/80">{use}</p>
    </div>
  );
};

export default ProductUsage;
