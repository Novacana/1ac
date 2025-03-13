
import React, { useState } from "react";
import { Product } from "@/types/product";
import { Button } from "../ui/button";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ProductActionButtonsProps {
  product: Product;
  getImagePath: (product: Product) => string;
}

const ProductActionButtons: React.FC<ProductActionButtonsProps> = ({ 
  product, 
  getImagePath 
}) => {
  const { addToCart } = useCart();
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCartClick = () => {
    // Check if user already gave consent (could be stored in localStorage in a real implementation)
    const hasConsent = localStorage.getItem("cart_consent") === "true";
    
    if (hasConsent) {
      addProductToCart();
    } else {
      setShowConsentDialog(true);
    }
  };

  const addProductToCart = () => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price || 9.99,
      image: getImagePath(product),
    };
    
    addToCart(productToAdd);
    setAddedToCart(true);
    
    // Reset the added state after 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
    
    toast.success(`${product.name} wurde zum Warenkorb hinzugefügt`);
  };

  const handleConfirmAddToCart = () => {
    // Store consent if given
    if (consentGiven) {
      localStorage.setItem("cart_consent", "true");
    }
    
    setShowConsentDialog(false);
    addProductToCart();
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className={`flex items-center gap-1 ${addedToCart ? 'bg-green-100 border-green-200' : 'bg-primary/10 border-primary/20 hover:bg-primary/20'}`}
        onClick={handleAddToCartClick}
      >
        {addedToCart ? (
          <>
            <Check size={14} className="text-green-600" />
            <span className="text-xs font-medium hidden sm:inline text-green-600">Hinzugefügt</span>
          </>
        ) : (
          <>
            <ShoppingCart size={14} />
            <span className="text-xs font-medium hidden sm:inline">Hinzufügen</span>
          </>
        )}
      </Button>

      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Einwilligung für den Warenkorb</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Um Produkte in den Warenkorb hinzuzufügen, benötigen wir Ihre Einwilligung zur Speicherung 
              der Produktdaten in Ihrem Browser. Diese Daten werden nur für die Dauer Ihrer Sitzung gespeichert.
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="consent" 
                checked={consentGiven} 
                onCheckedChange={(checked) => setConsentGiven(checked as boolean)} 
              />
              <Label htmlFor="consent" className="text-sm">
                Ich stimme der Speicherung meiner Warenkorb-Daten zu
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConsentDialog(false)}
            >
              Abbrechen
            </Button>
            <Button 
              onClick={handleConfirmAddToCart}
              disabled={!consentGiven}
            >
              Bestätigen und zum Warenkorb hinzufügen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductActionButtons;
