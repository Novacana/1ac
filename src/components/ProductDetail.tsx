
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductImages from "./ProductDetail/ProductImages";
import ProductBenefits from "./ProductDetail/ProductBenefits";
import ProductEffects from "./ProductDetail/ProductEffects";
import ProductUsage from "./ProductDetail/ProductUsage";
import QuantitySelector from "./ProductDetail/QuantitySelector";
import AddToCartButton from "./ProductDetail/AddToCartButton";
import ProductInfoPanel from "./ProductInfoPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import TerpeneProfile from "./ProductInfoPanel/TerpeneProfile";
import FlavorProfile from "./ProductInfoPanel/FlavorProfile";
import { Product } from "@/types/product";

export interface ProductDetailProps {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  thc?: string;
  cbd?: string;
  category: string;
  benefits?: string[];
  use?: string;
  effects?: string[];
  terpenes?: { name: string; percentage: string }[];
  flavors?: string[];
  origin?: string;
  product_type?: string;
  weight?: string;
  potency?: string;
  strain?: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  id,
  name,
  price,
  description,
  images,
  thc,
  cbd,
  category,
  benefits,
  use,
  effects,
  terpenes,
  flavors,
  strain,
  product_type,
  weight,
  potency,
  origin,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const packageSize = 10; // Package size in grams
  const isMobile = useIsMobile();

  const productData: Product = {
    id,
    name,
    price,
    description,
    image: images && images.length > 0 ? images[0] : "",
    images,
    thc,
    cbd,
    category,
    strain,
    terpenes,
    effects,
    flavors,
    origin,
    product_type,
    weight,
    potency,
  };

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log(`Hinzugefügt: ${quantity} Packungen von ${name} zum Warenkorb (${quantity * packageSize}g gesamt)`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className="container px-4 mx-auto pt-6 pb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium transition-all duration-200 hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Zurück zu Produkten
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <ProductImages 
              images={images} 
              name={name} 
              productId={id}
              productPrice={price}
              category={category}
              thc={thc}
              cbd={cbd}
              packageSize={packageSize}
            />
            
            {/* Terpene profile for desktop view - below the product image */}
            {!isMobile && terpenes && terpenes.length > 0 && (
              <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                <TerpeneProfile product={productData} />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-4 mb-6">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />
              
              <div className="text-lg font-medium bg-background border border-border/30 rounded-lg p-3 text-center">
                Gesamtpreis: <span className="font-bold text-xl">{`€${(price * quantity).toFixed(2)}`}</span> 
                <span className="text-sm text-muted-foreground ml-1">für {quantity * packageSize}g</span>
              </div>
              
              <AddToCartButton
                addedToCart={addedToCart}
                onAddToCart={handleAddToCart}
                productId={id}
                productName={name}
                productPrice={price}
                productImage={images && images.length > 0 ? images[0] : ""}
              />
            </div>

            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
              <ProductInfoPanel product={productData} />
              
              {/* Only show flavor profile in desktop view */}
              {!isMobile && (
                <div className="mt-4 border-t border-border/30 pt-4">
                  <FlavorProfile flavors={flavors} />
                </div>
              )}
            </div>

            <p className="text-foreground/80 leading-relaxed">{description}</p>

            <ProductBenefits benefits={benefits} />

            <ProductEffects effects={effects} />

            <ProductUsage use={use} />
            
            {/* Show terpene profile in mobile view */}
            {isMobile && terpenes && terpenes.length > 0 && (
              <div className="mt-4 bg-background/50 rounded-lg p-3 border border-border/30">
                <TerpeneProfile product={productData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
