
import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductQuantityProps {
  quantity: number;
  onQuantityChange: (amount: number) => void;
  onAddToCart: () => void;
  addedToCart: boolean;
}

const ProductQuantity: React.FC<ProductQuantityProps> = ({
  quantity,
  onQuantityChange,
  onAddToCart,
  addedToCart,
}) => {
  const { t } = useLanguage();

  return (
    <div className="pt-4 space-y-6">
      <div className="flex items-center">
        <span className="mr-4">{t("quantity")}</span>
        <div className="flex items-center border border-input rounded-md">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(-1)}
            disabled={quantity <= 1}
            className="h-9 w-9 rounded-none"
          >
            <Minus className="h-3 w-3" />
            <span className="sr-only">{t("decrease_quantity")}</span>
          </Button>

          <span className="w-12 text-center">{quantity}</span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(1)}
            disabled={quantity >= 10}
            className="h-9 w-9 rounded-none"
          >
            <Plus className="h-3 w-3" />
            <span className="sr-only">{t("increase_quantity")}</span>
          </Button>
        </div>
      </div>

      <Button
        className="w-full transition-all duration-300"
        onClick={onAddToCart}
        disabled={addedToCart}
      >
        {addedToCart ? (
          <>
            <Check className="h-5 w-5 mr-2" />
            {t("added_to_cart")}
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 mr-2" />
            {t("add_to_cart")}
          </>
        )}
      </Button>
    </div>
  );
};

export default ProductQuantity;
