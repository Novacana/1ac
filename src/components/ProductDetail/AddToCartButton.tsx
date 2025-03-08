
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const handleAddToCartClick = () => {
    // Check if user already gave consent
    const hasConsent = localStorage.getItem("cart_consent") === "true";
    
    if (hasConsent) {
      addProductToCart();
    } else {
      setShowConsentDialog(true);
    }
  };

  const addProductToCart = () => {
    addToCart({
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      quantity: 1,
    });
    onAddToCart();
    toast.success(`${productName} wurde zum Warenkorb hinzugefügt`);
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
        className="w-full transition-all duration-300"
        onClick={handleAddToCartClick}
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

      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Einwilligung für den Warenkorb</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Um Produkte in den Warenkorb hinzuzufügen, benötigen wir Ihre Einwilligung zur Speicherung 
              der Produktdaten in Ihrem Browser. Diese Daten werden nur für die Dauer Ihrer Sitzung gespeichert 
              und dienen ausschließlich dem Kaufprozess.
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox 
                id="consent-detail" 
                checked={consentGiven} 
                onCheckedChange={(checked) => setConsentGiven(checked as boolean)} 
              />
              <Label htmlFor="consent-detail" className="text-sm">
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

export default AddToCartButton;
