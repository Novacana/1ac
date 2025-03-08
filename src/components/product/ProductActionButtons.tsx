
import React from "react";
import { Product } from "@/types/product";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface ProductActionButtonsProps {
  product: Product;
  getImagePath: (product: Product) => string;
}

const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({ 
  product, 
  getImagePath 
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price || 9.99,
      image: getImagePath(product),
      quantity: 1
    };
    
    addToCart(productToAdd);
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1 bg-primary/10 border-primary/20 hover:bg-primary/20"
      onClick={handleAddToCart}
    >
      <ShoppingCart size={14} />
      <span className="text-xs font-medium hidden sm:inline">Hinzufügen</span>
    </Button>
  );
};

export default ProductActionButtons;
