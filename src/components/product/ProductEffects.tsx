
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductEffectsProps {
  effects?: string[];
}

const ProductEffects: React.FC<ProductEffectsProps> = ({ effects }) => {
  const { t } = useLanguage();

  if (!effects?.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">{t("effects")}</h3>
      <div className="flex flex-wrap gap-2">
        {effects.map((effect, index) => (
          <span
            key={index}
            className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {effect}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProductEffects;
