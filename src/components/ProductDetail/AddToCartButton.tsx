
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";

interface AddToCartButtonProps {
  addedToCart: boolean;
  onAddToCart: () => void;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  addedToCart,
  onAddToCart,
}) => {
  return (
    <Button
      className="w-full transition-all duration-300"
      onClick={onAddToCart}
      disabled={addedToCart}
    >
      {addedToCart ? (
        <>
          <Check className="h-5 w-5 mr-2" />
          Zum Warenkorb hinzugefügt
        </>
      ) : (
        <>
          <ShoppingCart className="h-5 w-5 mr-2" />
          Zum Warenkorb hinzufügen
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;
