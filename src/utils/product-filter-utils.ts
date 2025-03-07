
import { Product } from "@/types/product";
import { getCategoryMapping, getBestCategoryMatch } from "@/utils/woocommerce";

/**
 * Filter products by category
 */
export const filterProductsByCategory = (products: Product[], selectedCategory: string): Product[] => {
  if (selectedCategory === "All") {
    return products;
  }
  
  return products.filter(product => {
    const productCategory = product.category;
    const normalizedCategory = selectedCategory;
    
    // Match exact category name
    if (productCategory === normalizedCategory) {
      return true;
    }
    
    // Check if the product category maps to the selected category
    if (getCategoryMapping(productCategory) === normalizedCategory) {
      return true;
    }
    
    // Try to match by keywords if exact match fails
    if (getBestCategoryMatch(productCategory) === normalizedCategory) {
      return true;
    }
    
    return false;
  });
};

/**
 * Remove duplicate products by ID
 */
export const removeDuplicateProducts = (products: Product[]): Product[] => {
  return Array.from(
    new Map(products.map(item => [item.id, item])).values()
  );
};
