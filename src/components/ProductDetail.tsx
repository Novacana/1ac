
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
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
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-xl border border-border/40 bg-card">
              <div
                className={cn(
                  "absolute inset-0 bg-card/20 backdrop-blur-sm flex items-center justify-center z-0 transition-opacity duration-300",
                  isImageLoaded ? "opacity-0" : "opacity-100"
                )}
              >
                <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
              </div>
              {images && images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={name}
                  className={cn(
                    "w-full h-full object-cover transition-opacity duration-500",
                    isImageLoaded ? "opacity-100" : "opacity-0"
                  )}
                  onLoad={() => setIsImageLoaded(true)}
                  onError={(e) => {
                    console.error("Fehler beim Laden des Bildes:", e);
                    setIsImageLoaded(false);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Kein Bild verfügbar
                </div>
              )}
            </div>

            {images && images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 snap-start",
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-primary/30"
                    )}
                  >
                    <img
                      src={img}
                      alt={`${name} Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error(`Fehler beim Laden des Thumbnails ${index}:`, e);
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-secondary text-xs px-3 py-1 rounded-full text-secondary-foreground">
                  {category}
                </span>
                {(thc || cbd) && (
                  <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                    {thc && `THC: ${thc}`}
                    {thc && cbd && " | "}
                    {cbd && `CBD: ${cbd}`}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold">{name}</h1>
              <p className="text-2xl font-bold mt-2">€{price.toFixed(2)}</p>
            </div>

            <p className="text-foreground/80 leading-relaxed">{description}</p>

            {/* Benefits */}
            {benefits?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Vorteile</h3>
                <ul className="space-y-1">
                  {benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm animate-slide-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Effects */}
            {effects?.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Wirkungen</h3>
                <div className="flex flex-wrap gap-2">
                  {effects.map((effect, index) => (
                    <span
                      key={index}
                      className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full animate-scale-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* How to use */}
            {use && (
              <div className="space-y-2">
                <h3 className="font-semibold">Anwendung</h3>
                <p className="text-sm text-foreground/80">{use}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="pt-4 space-y-6">
              <div className="flex items-center">
                <span className="mr-4">Menge</span>
                <div className="flex items-center border border-input rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-9 w-9 rounded-none"
                  >
                    <Minus className="h-3 w-3" />
                    <span className="sr-only">Menge verringern</span>
                  </Button>

                  <span className="w-12 text-center">{quantity}</span>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="h-9 w-9 rounded-none"
                  >
                    <Plus className="h-3 w-3" />
                    <span className="sr-only">Menge erhöhen</span>
                  </Button>
                </div>
              </div>

              <Button
                className="w-full transition-all duration-300"
                onClick={handleAddToCart}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
