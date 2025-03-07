
import React, { useState, useEffect } from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import CarouselNavigation from "@/components/CarouselNavigation";
import { Product } from "@/types/product";

interface ProductCarouselProps {
  products: Product[];
  selectedCategory: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, selectedCategory }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({});

  // Reset carousel state when products change
  useEffect(() => {
    setActiveIndex(0);
    setImagesLoaded({});
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % products.length);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  const goToIndex = (index: number) => {
    if (isTransitioning || index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 500); // Match transition duration
  };

  const activeProduct = products[activeIndex];

  // Ensure image path is correct
  const getImagePath = (imageSrc: string) => {
    // Fix path if starts with public/
    if (imageSrc.startsWith("public/")) {
      return imageSrc.replace("public/", "/");
    }
    // Add leading slash if needed
    if (!imageSrc.startsWith("http") && !imageSrc.startsWith("/")) {
      return "/" + imageSrc;
    }
    return imageSrc;
  };
  
  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault(); // Prevent navigating to product page when clicking the cart button
    e.stopPropagation(); // Stop event from bubbling up
    toast.success(`${product.name} wurde zum Warenkorb hinzugefügt`);
    console.log(`Added ${product.name} to cart`);
  };

  const imageLoaded = (productId: string) => {
    setImagesLoaded((prev) => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="relative pb-12">
      {/* Featured Product Section */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 mb-6 transition-all duration-500 ease-out">
        {/* Product Image */}
        <div className="md:w-1/2 relative overflow-hidden rounded-xl bg-card aspect-square md:aspect-auto">
          <Link to={`/product/${activeProduct.id}`} className="block w-full h-full">
            <div
              className="absolute inset-0 flex items-center justify-center bg-card/20 z-10 transition-opacity duration-300"
              style={{ opacity: imagesLoaded[activeProduct.id] ? 0 : 1 }}
            >
              <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            </div>
            
            <img
              src={activeProduct.images?.[0] ? getImagePath(activeProduct.images[0]) : "/placeholder.svg"}
              alt={activeProduct.name}
              className="w-full h-full object-contain transition-all duration-500 ease-out"
              style={{ opacity: imagesLoaded[activeProduct.id] ? 1 : 0 }}
              onLoad={() => imageLoaded(activeProduct.id)}
              onError={(e) => {
                console.error("Image load error:", e);
                (e.target as HTMLImageElement).src = "/placeholder.svg";
                imageLoaded(activeProduct.id);
              }}
            />
            
            {/* Add to cart button in the top right corner */}
            <Button
              size="icon"
              className="absolute top-3 right-3 z-20 rounded-full shadow-md hover:shadow-lg transition-all duration-200"
              onClick={(e) => handleAddToCart(e, activeProduct)}
              title="Zum Warenkorb hinzufügen"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {activeProduct.category === "Blüten" ? "Cannabis Blüten" : 
                 activeProduct.category === "Öle" ? "Cannabis Öle" : 
                 activeProduct.category}
              </span>
              <h2 className="text-3xl font-bold mt-1">{activeProduct.name}</h2>
            </div>

            <p className="text-foreground/80 text-base leading-relaxed line-clamp-4">
              {activeProduct.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {activeProduct.thc && (
                <span className="px-3 py-1 bg-secondary/50 rounded-full text-sm font-medium">
                  THC: {activeProduct.thc}
                </span>
              )}
              {activeProduct.cbd && (
                <span className="px-3 py-1 bg-secondary/50 rounded-full text-sm font-medium">
                  CBD: {activeProduct.cbd}
                </span>
              )}
              {activeProduct.strain && (
                <span className="px-3 py-1 bg-secondary/50 rounded-full text-sm font-medium">
                  {activeProduct.strain}
                </span>
              )}
            </div>

            <div className="flex items-end justify-between pt-2">
              <span className="text-2xl font-bold">€{activeProduct.price.toFixed(2)}</span>
              <Link 
                to={`/product/${activeProduct.id}`}
                className="inline-flex items-center text-primary hover:underline"
              >
                Details ansehen
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation */}
      <CarouselNavigation
        activeIndex={activeIndex}
        totalItems={products.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onDotClick={goToIndex}
      />
    </div>
  );
};

export default ProductCarousel;
