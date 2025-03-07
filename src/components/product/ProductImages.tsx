
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  images: string[];
  name: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
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
        <img
          src={images[selectedImage]}
          alt={name}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isImageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setIsImageLoaded(true)}
        />
      </div>

      {images.length > 1 && (
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
                alt={`${name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
