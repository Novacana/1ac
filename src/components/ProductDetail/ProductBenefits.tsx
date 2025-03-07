
import React from "react";
import { Check } from "lucide-react";

interface ProductBenefitsProps {
  benefits?: string[];
}

const ProductBenefits: React.FC<ProductBenefitsProps> = ({ benefits }) => {
  if (!benefits?.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Vorteile</h3>
      <ul className="space-y-1">
        {benefits.map((benefit, index) => (
          <li
            key={index}
            className="flex items-start gap-2 text-sm animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductBenefits;
