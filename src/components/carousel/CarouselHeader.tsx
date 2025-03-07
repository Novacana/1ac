
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCarousel } from "./CarouselContext";
import { useCart } from "@/contexts/CartContext";

const CarouselHeader: React.FC = () => {
  const { products, activeIndex, getImagePath } = useCarousel();
  const { addToCart } = useCart();
  
  const activeProduct = products[activeIndex];
  
  const handleAddToCart = () => {
    const productToAdd = {
      id: activeProduct.id,
      name: activeProduct.name,
      price: activeProduct.price || 9.99,
      image: getImagePath(activeProduct),
      quantity: 1
    };
    
    addToCart(productToAdd);
  };
  
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold text-primary mt-2">{activeProduct.name}</h2>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 bg-primary/10 border-primary/20 hover:bg-primary/20"
        onClick={handleAddToCart}
      >
        <ShoppingCart size={14} />
        <span className="text-xs font-medium hidden sm:inline">Hinzufügen</span>
      </Button>
    </div>
  );
};

export default CarouselHeader;
