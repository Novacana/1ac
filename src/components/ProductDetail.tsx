
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ProductImages from "./ProductDetail/ProductImages";
import ProductHeader from "./ProductDetail/ProductHeader";
import ProductBenefits from "./ProductDetail/ProductBenefits";
import ProductEffects from "./ProductDetail/ProductEffects";
import ProductUsage from "./ProductDetail/ProductUsage";
import QuantitySelector from "./ProductDetail/QuantitySelector";
import AddToCartButton from "./ProductDetail/AddToCartButton";

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
}) => {
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log(`Hinzugefügt: ${quantity} von ${name} zum Warenkorb`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    // Here you would add the product to the cart state/context
  };

  // Konsolenlog hinzugefügt, um zu prüfen, welche Bilder geladen werden sollen
  console.log("Loading product images:", images);

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
          {/* Product Images */}
          <ProductImages 
            images={images} 
            name={name} 
            productId={id}
            productPrice={price}
          />

          {/* Product Info */}
          <div className="space-y-6">
            <ProductHeader
              name={name}
              price={price}
              category={category}
              thc={thc}
              cbd={cbd}
            />

            <p className="text-foreground/80 leading-relaxed">{description}</p>

            {/* Benefits */}
            <ProductBenefits benefits={benefits} />

            {/* Effects */}
            <ProductEffects effects={effects} />

            {/* How to use */}
            <ProductUsage use={use} />

            {/* Quantity and Add to Cart */}
            <div className="pt-4 space-y-6">
              <QuantitySelector
                quantity={quantity}
                onQuantityChange={handleQuantityChange}
              />

              <AddToCartButton
                addedToCart={addedToCart}
                onAddToCart={handleAddToCart}
                productId={id}
                productName={name}
                productPrice={price}
                productImage={images && images.length > 0 ? images[0] : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
