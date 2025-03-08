
import { Product } from "@/types/product";

/**
 * Get the correct image path for a product
 */
export const getImagePath = (product: any) => {
  try {
    // Check if product has images array
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      let imagePath = product.images[0];
      
      if (typeof imagePath !== 'string') {
        console.error("Invalid image path type:", imagePath);
        return "/placeholder.svg";
      }
      
      // Fix path if it starts with public/
      if (imagePath.startsWith("public/")) {
        return imagePath.replace("public/", "/");
      }
      
      // Add leading slash if needed
      if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
        return "/" + imagePath;
      }
      
      return imagePath;
    }
    
    // Check if product has a single image
    if (product.image && typeof product.image === 'string') {
      let imagePath = product.image;
      
      // Fix path if it starts with public/
      if (imagePath.startsWith("public/")) {
        return imagePath.replace("public/", "/");
      }
      
      // Add leading slash if needed
      if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
        return "/" + imagePath;
      }
      
      return imagePath;
    }
  } catch (error) {
    console.error("Error processing image path:", error);
  }
  
  // Fallback to placeholder
  return "/placeholder.svg";
};

/**
 * Convert local products to the Product type with fixed image paths
 */
export const convertLocalProducts = (products: any[]): Product[] => {
  if (!Array.isArray(products)) {
    console.error("convertLocalProducts received non-array input:", products);
    return [];
  }
  
  try {
    return products.map(product => {
      if (!product) {
        console.error("Null or undefined product in convertLocalProducts");
        return null;
      }
      
      // Ensure images is an array and fix paths
      const fixedImages = Array.isArray(product.images) 
        ? product.images.map((img: string) => {
            if (!img) return "/placeholder.svg";
            if (typeof img !== 'string') {
              console.error("Invalid image path type:", img);
              return "/placeholder.svg";
            }
            if (img.startsWith("public/")) {
              return img.replace("public/", "/");
            }
            return img.startsWith("/") ? img : `/${img}`;
          })
        : [];
      
      // Fix single image property if it exists
      let fixedSingleImage = "/placeholder.svg";
      if (product.image) {
        if (typeof product.image === 'string') {
          if (product.image.startsWith("public/")) {
            fixedSingleImage = product.image.replace("public/", "/");
          } else {
            fixedSingleImage = product.image.startsWith("/") ? product.image : `/${product.image}`;
          }
        } else {
          console.error("Invalid image property type:", product.image);
        }
      }
      
      return {
        ...product,
        image: fixedImages.length > 0 ? fixedImages[0] : fixedSingleImage,
        images: fixedImages.length > 0 ? fixedImages : [fixedSingleImage]
      } as Product;
    }).filter(Boolean);
  } catch (error) {
    console.error("Error in convertLocalProducts:", error);
    return [];
  }
};
