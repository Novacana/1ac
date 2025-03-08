
import React from "react";
import ProductImageDisplay from "./ProductImageDisplay";
import ProductImageThumbnails from "./ProductImageThumbnails";
import ProductInfo from "./ProductInfo";

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
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [fixedImages, setFixedImages] = React.useState<string[]>([]);

  // Function to fix image paths
  const getFixedImagePath = (path: string) => {
    if (path.startsWith("public/")) {
      return path.replace("public/", "/");
    }
    if (!path.startsWith("http") && !path.startsWith("/")) {
      return "/" + path;
    }
    return path;
  };

  React.useEffect(() => {
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
        };
        img.src = imgPath;
      });
    } else {
      setFixedImages(["/placeholder.svg"]);
    }
  }, [images]);

  return (
    <div className="space-y-3">
      {/* Product Info - Positioned above the image */}
      <ProductInfo 
        name={name}
        productPrice={productPrice}
        category={category}
        thc={thc}
        cbd={cbd}
        packageSize={packageSize}
      />
      
      <ProductImageDisplay 
        fixedImages={fixedImages}
        selectedImage={selectedImage}
        name={name}
        productId={productId}
        productPrice={productPrice}
      />

      {fixedImages && fixedImages.length > 1 && (
        <ProductImageThumbnails 
          images={fixedImages}
          name={name}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </div>
  );
};

export default ProductImages;
