
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductImagesProps {
  images: string[];
  name: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [fixedImages, setFixedImages] = useState<string[]>([]);

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

  return (
    <div className="space-y-4">
      <div className="aspect-square relative overflow-hidden rounded-xl border border-border/40 bg-card">
        <div
          className={cn(
            "absolute inset-0 bg-card/20 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity duration-300",
            isImageLoaded ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
        </div>
        {fixedImages && fixedImages.length > 0 ? (
          <img
            src={fixedImages[selectedImage]}
            alt={name}
            className={cn(
              "w-full h-full object-contain transition-opacity duration-500 z-0",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
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
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Kein Bild verfügbar
          </div>
        )}
      </div>

      {fixedImages && fixedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 snap-x">
          {fixedImages.map((img, index) => (
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
