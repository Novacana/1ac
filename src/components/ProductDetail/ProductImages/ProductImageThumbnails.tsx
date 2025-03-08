
import React from "react";
import { cn } from "@/lib/utils";

interface ProductImageThumbnailsProps {
  images: string[];
  name: string;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
}

const ProductImageThumbnails: React.FC<ProductImageThumbnailsProps> = ({
  images,
  name,
  selectedImage,
  setSelectedImage
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 snap-x max-w-md mx-auto">
      {images.map((img, index) => (
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
  );
};

export default ProductImageThumbnails;
