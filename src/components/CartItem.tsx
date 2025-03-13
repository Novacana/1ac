
import React, { useState } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: () => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  image,
  quantity,
  onUpdateQuantity,
  onRemove,
}) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove();
    }, 300);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleImageError = () => {
    console.error("CartItem image error:", image);
    setImageError(true);
    setIsImageLoaded(true);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-lg border border-border/40 transition-all duration-300 animate-slide-up",
        isRemoving && "opacity-0 translate-x-8"
      )}
    >
      <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden bg-muted">
        <div
          className={cn(
            "absolute inset-0 bg-card/20 backdrop-blur-sm flex items-center justify-center z-0 transition-opacity duration-300",
            isImageLoaded ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
        </div>
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Kein Bild</span>
          </div>
        ) : (
          <img
            src={image}
            alt={name}
            className={cn(
              "h-full w-full object-cover transition-opacity duration-500",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsImageLoaded(true)}
            onError={handleImageError}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div>
            <h3 className="text-base font-medium line-clamp-1">{name}</h3>
            <p className="text-sm text-foreground/60 mt-0.5">€{price.toFixed(2)}</p>
          </div>

          <div className="flex items-center">
            <div className="flex items-center border border-input rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="h-8 w-8 rounded-none"
              >
                <Minus className="h-3 w-3" />
                <span className="sr-only">Menge verringern</span>
              </Button>

              <span className="w-8 text-center text-sm">{quantity}</span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
                className="h-8 w-8 rounded-none"
              >
                <Plus className="h-3 w-3" />
                <span className="sr-only">Menge erhöhen</span>
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="text-destructive h-8 w-8 ml-2"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Entfernen</span>
            </Button>
          </div>
        </div>

        <div className="mt-2 sm:mt-1 flex justify-between items-center">
          <p className="text-sm">
            Zwischensumme: <span className="font-semibold">€{(price * quantity).toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
