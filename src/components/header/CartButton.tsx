
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface CartButtonProps {
  cartCount: number;
}

const CartButton: React.FC<CartButtonProps> = ({ cartCount }) => {
  return (
    <Link to="/cart">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-background/10"
        aria-label="Warenkorb"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center animate-scale-in">
            {cartCount}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartButton;
