
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import BackToProducts from "./product/BackToProducts";
import ProductImages from "./product/ProductImages";
import ProductHeader from "./product/ProductHeader";
import ProductDescription from "./product/ProductDescription";
import ProductBenefits from "./product/ProductBenefits";
import ProductEffects from "./product/ProductEffects";
import ProductUsage from "./product/ProductUsage";
import ProductQuantity from "./product/ProductQuantity";

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
  const { t } = useLanguage();

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${name} to cart`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    // Here you would add the product to the cart state/context
  };

  return (
    <div className="animate-fade-in">
      <div className="container px-4 mx-auto pt-6 pb-8">
        <BackToProducts />

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <ProductImages images={images} name={name} />

          {/* Product Info */}
          <div className="space-y-6">
            <ProductHeader 
              name={name} 
              price={price} 
              category={category} 
              thc={thc} 
              cbd={cbd} 
            />

            <ProductDescription description={description} />

            {/* Benefits */}
            <ProductBenefits benefits={benefits} />

            {/* Effects */}
            <ProductEffects effects={effects} />

            {/* How to use */}
            <ProductUsage use={use} />

            {/* Quantity and Add to Cart */}
            <ProductQuantity 
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              addedToCart={addedToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
