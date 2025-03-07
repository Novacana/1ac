
import { Product } from "@/types/product";

/**
 * Get the correct image path for a product
 */
export const getImagePath = (product: any) => {
  // Check if product has images array
  if (product.images && product.images.length > 0) {
    let imagePath = product.images[0];
    
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
  if (product.image) {
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
  
  // Fallback to placeholder
  return "/placeholder.svg";
};

/**
 * Convert local products to the Product type with fixed image paths
 */
export const convertLocalProducts = (products: any[]): Product[] => {
  return products.map(product => {
    // Ensure images is an array and fix paths
    const fixedImages = (product.images || []).map((img: string) => {
      if (img.startsWith("public/")) {
        return img.replace("public/", "/");
      }
      return img.startsWith("/") ? img : `/${img}`;
    });
    
    return {
      ...product,
      image: fixedImages[0] || "/placeholder.svg", // Add required image property
      images: fixedImages.length > 0 ? fixedImages : ["/placeholder.svg"]
    } as Product;
  });
};
