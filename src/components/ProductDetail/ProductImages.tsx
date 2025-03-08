
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductImagesProps {
  images: string[];
  name: string;
  productId: string;
  productPrice: number;
  category?: string;
  thc?: string;
  cbd?: string;
  packageSize?: number;
}

const ProductImages: React.FC<ProductImagesProps> = ({ 
  images, 
  name,
  productId,
  productPrice,
  category,
  thc,
  cbd,
  packageSize = 10
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [fixedImages, setFixedImages] = useState<string[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

  // Function to fix image paths
  const getFixedImagePath = (path: string) => {
    // If the path starts with "public/", remove it as it's already in the public folder
    if (path.startsWith("public/")) {
      return path.replace("public/", "/");
    }

    // Handle other potential path issues
    if (!path.startsWith("http") && !path.startsWith("/")) {
      return "/" + path;
    }

    return path;
  };

  useEffect(() => {
    // Process and fix image paths when the images prop changes
    if (images && images.length > 0) {
      const processed = images.map(getFixedImagePath);
      setFixedImages(processed);
      console.log("Fixed product images in ProductImages:", processed);
      
      // Preload the images to check for errors
      processed.forEach((imgPath, index) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Preloaded image ${index} successfully:`, imgPath);
        };
        img.onerror = () => {
          console.error(`Failed to preload image ${index}:`, imgPath);
          toast.error(`Ein Produktbild konnte nicht geladen werden`);
        };
        img.src = imgPath;
      });
    } else {
      setFixedImages(["/placeholder.svg"]);
    }
    
    // Reset loading state when images change
    setIsImageLoaded(false);
  }, [images]);

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: name,
      price: productPrice,
      image: fixedImages[selectedImage],
      quantity: 1,
    });
    toast.success(`${name} wurde zum Warenkorb hinzugefügt`);
  };

  return (
    <div className="space-y-3">
      {/* Product Info - Positioned above the image */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {category && (
            <span className="bg-background text-foreground rounded-full px-4 py-1 text-sm font-medium border border-border/40">
              {category}
            </span>
          )}
          {(thc || cbd) && (
            <span className="bg-green-500 text-white rounded-full px-4 py-1 text-sm font-medium">
              {thc && `THC: ${thc}`} {thc && cbd && "| "} {cbd && `CBD: ${cbd}`}
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap justify-between items-baseline gap-2 mt-2">
          <h1 className="text-3xl font-bold text-foreground">{name}</h1>
          <div className="text-2xl font-bold text-foreground">
            €{productPrice.toFixed(2)}
            <span className="text-sm font-normal text-muted-foreground ml-1">/ {packageSize}g</span>
          </div>
        </div>
      </div>

      <div 
        className="relative overflow-hidden rounded-lg border border-border/40 bg-card max-w-md mx-auto"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={cn(
            "absolute inset-0 bg-card/20 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity duration-300",
            isImageLoaded ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
        </div>
        {fixedImages && fixedImages.length > 0 ? (
          <>
            <img
              src={fixedImages[selectedImage]}
              alt={name}
              className={cn(
                "w-full h-auto object-contain transition-opacity duration-500 z-0 p-4",
                isImageLoaded ? "opacity-100" : "opacity-0"
              )}
              style={{ maxHeight: "400px" }}
              onLoad={() => {
                console.log(`Main image loaded successfully:`, fixedImages[selectedImage]);
                setIsImageLoaded(true);
              }}
              onError={(e) => {
                console.error("Fehler beim Laden des Bildes:", e, "Quelle:", fixedImages[selectedImage]);
                toast.error(`Hauptbild konnte nicht geladen werden`);
                (e.target as HTMLImageElement).src = "/placeholder.svg";
                setIsImageLoaded(true);
              }}
            />
            
            {/* Add to cart button overlay - only on mobile */}
            {isMobile && (
              <div 
                className={cn(
                  "absolute bottom-4 left-0 right-0 flex justify-center items-center transition-opacity duration-300 z-20",
                  isHovered || isImageLoaded ? "opacity-100" : "opacity-0"
                )}
              >
                <Button 
                  onClick={handleAddToCart}
                  size="sm"
                  className="bg-primary/90 hover:bg-primary shadow-md"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  In den Warenkorb
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Kein Bild verfügbar
          </div>
        )}
      </div>

      {fixedImages && fixedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 snap-x max-w-md mx-auto">
          {fixedImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={cn(
                "shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 snap-start",
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
                  console.error(`Fehler beim Laden des Thumbnails ${index}:`, e, "Quelle:", img);
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
