import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "@/data/products";
import { toast } from "sonner";
import { ArrowLeft, Share } from "lucide-react";

import ProductImages from "./ProductDetail/ProductImages";
import ProductHeader from "./ProductDetail/ProductHeader";
import ProductEffects from "./ProductDetail/ProductEffects";
import ProductBenefits from "./ProductDetail/ProductBenefits";
import ProductUsage from "./ProductDetail/ProductUsage";
import AddToCartButton from "./ProductDetail/AddToCartButton";
import QuantitySelector from "./ProductDetail/QuantitySelector";
import ProductNotFound from "./ProductNotFound";
import ProductLoading from "./ProductLoading";
import { Button } from "./ui/button";
import { Product } from "@/types/product";

// Export the interface so it can be imported by other files
export interface ProductDetailProps extends Omit<Product, 'image'> {
  image?: string;
  benefits?: string[];
  use?: string;
  effects?: string[];
  terpenes?: { name: string; percentage: string }[];
  flavors?: string[];
  origin?: string;
  recommended_use?: string;
  lab_tested?: boolean;
  product_type?: string;
  weight?: string;
  potency?: string;
  strain?: string;
}

const ProductDetail = (props: ProductDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If product was passed as props, use it instead of fetching
    if (Object.keys(props).length > 0) {
      setProduct(props);
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      setLoading(true);
      try {
        // Find the product with the matching ID
        const foundProduct = getProductById(id || "");
        
        if (foundProduct) {
          console.log("Found product:", foundProduct);
          setProduct(foundProduct);
        } else {
          console.log("Product not found with ID:", id);
          toast.error("Produkt nicht gefunden");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Fehler beim Laden des Produkts");
      } finally {
        // Simulate network delay for smoother UX
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    if (id) {
      loadProduct();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [id, props]);

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + amount)));
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    setAddedToCart(true);
    
    timeoutRef.current = setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const handleShare = async () => {
    if (navigator.share && product) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing", error);
        toast.error("Teilen fehlgeschlagen");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link in die Zwischenablage kopiert");
    }
  };

  if (loading) {
    return <ProductLoading />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleGoBack}
          className="hover:bg-secondary"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Zurück</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="hover:bg-secondary"
        >
          <Share className="h-5 w-5" />
          <span className="sr-only">Teilen</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductImages images={product.images || [product.image || ""]} name={product.name} />

        <div className="space-y-6">
          <ProductHeader
            name={product.name}
            price={product.price || 9.99}
            category={product.category || "Sonstiges"}
            thc={product.thc}
            cbd={product.cbd}
          />

          <div className="space-y-4">
            <ProductEffects effects={product.effects} />
            <ProductBenefits benefits={product.benefits} />
            <ProductUsage use={product.use} />
          </div>

          <div className="pt-4 border-t border-border space-y-4">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
            />

            <AddToCartButton
              addedToCart={addedToCart}
              onAddToCart={handleAddToCart}
              productId={product.id.toString()}
              productName={product.name}
              productPrice={product.price || 9.99}
              productImage={product.image || product.images?.[0] || "/placeholder.svg"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
