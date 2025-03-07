
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface AddToCartButtonProps {
  addedToCart: boolean;
  onAddToCart: () => void;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  addedToCart,
  onAddToCart,
  productId,
  productName,
  productPrice,
  productImage,
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
    onAddToCart();
  };

  return (
    <Button
      className="w-full transition-all duration-300"
      onClick={handleAddToCart}
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
