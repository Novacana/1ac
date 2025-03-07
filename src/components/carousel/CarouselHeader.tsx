
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCarousel } from "./CarouselContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

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
    toast.success(`${activeProduct.name} wurde zum Warenkorb hinzugefügt`);
  };
  
  return (
    <div className="flex justify-between items-center bg-background/60 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-border/20">
      <h2 className="text-xl font-semibold text-primary mt-2 truncate pr-2">{activeProduct.name}</h2>
      <Button 
        variant="default" 
        size="sm" 
        className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        onClick={handleAddToCart}
      >
        <ShoppingCart size={14} />
        <span className="text-xs font-medium hidden sm:inline">Hinzufügen</span>
      </Button>
    </div>
  );
};

export default CarouselHeader;
