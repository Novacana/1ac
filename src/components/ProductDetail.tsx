
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
import ProductDetailPanel from "./ProductDetailPanel";
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
      <div className="container px-4 mx-auto pt-8 pb-12">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium transition-all duration-200 hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Zurück zu Produkten
        </Link>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
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

          <div className="space-y-8">
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-0.5">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={handleQuantityChange}
                />
              </div>
              
              <div className="text-lg font-medium bg-primary/5 border border-primary/10 rounded-lg p-4 text-center shadow-sm">
                Gesamtpreis: <span className="font-bold text-xl text-primary">{`€${(price * quantity).toFixed(2)}`}</span> 
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

            <div className="bg-card/5 rounded-lg p-5 border border-border/20 shadow-sm backdrop-blur-sm">
              <ProductInfoPanel product={productData} />
              <ProductDetailPanel product={productData} />
            </div>

            <p className="text-foreground/80 leading-relaxed text-base">{description}</p>

            <ProductBenefits benefits={benefits} />

            <ProductEffects effects={effects} />

            <ProductUsage use={use} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
