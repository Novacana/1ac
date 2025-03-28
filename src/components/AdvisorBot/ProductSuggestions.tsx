
import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { ProductDetailProps } from "@/components/ProductDetail";

interface ProductSuggestionsProps {
  showProducts: boolean;
  recommendedProducts: ProductDetailProps[];
  onProductClick: () => void;
}

const ProductSuggestions: React.FC<ProductSuggestionsProps> = ({
  showProducts,
  recommendedProducts,
  onProductClick,
}) => {
  if (!showProducts || recommendedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 grid gap-2 max-w-[90%]">
      {recommendedProducts.map((product) => (
        <Link 
          to={`/product/${product.id}`}
          key={product.id}
          className="flex items-center gap-3 p-2 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 animate-scale-in"
          onClick={onProductClick}
        >
          <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary/20 shrink-0">
            <img 
              src={product.images?.[0] || "/placeholder.svg"} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-xs bg-secondary/40 px-1.5 py-0.5 rounded">{
                product.category === "Blüten" ? "Blüten" : 
                product.category === "Öle" ? "Öle" : 
                product.category
              }</span>
              <span className="font-bold text-sm">€{product.price.toFixed(2)}</span>
            </div>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
        </Link>
      ))}
    </div>
  );
};

export default ProductSuggestions;
