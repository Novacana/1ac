
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { 
  fetchWooCommerceProducts, 
  isWooCommerceConfigured,
  getCategoryMapping,
  getBestCategoryMatch
} from "@/utils/woocommerce";
import { toast } from "sonner";

type DataSource = "woocommerce" | "combined" | "local";

interface UseProductLoaderProps {
  selectedCategory: string;
  onProductsLoaded: (products: Product[], source: DataSource) => void;
}

interface UseProductLoaderResult {
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to load products from various sources
 */
export const useProductLoader = ({
  selectedCategory,
  onProductsLoaded
}: UseProductLoaderProps): UseProductLoaderResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);
  const previousCategoryRef = useRef(selectedCategory);

  useEffect(() => {
    // Only load products if:
    // 1. We haven't loaded them yet
    // 2. OR the category has changed
    if (loadedRef.current && previousCategoryRef.current === selectedCategory) {
      return;
    }

    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { allProducts, dataSource } = await loadProductsFromAllSources(selectedCategory, loadedRef.current);
        
        console.log(`Combined and filtered to ${allProducts.length} products for category ${selectedCategory}`);
        
        // Remove potential duplicates (by ID)
        const uniqueProducts = removeDuplicateProducts(allProducts);
        
        console.log(`Final unique product count: ${uniqueProducts.length} (Data source: ${dataSource})`);
        
        // Mark as loaded and store current category
        loadedRef.current = true;
        previousCategoryRef.current = selectedCategory;
        
        // Pass the filtered products and data source to parent component
        onProductsLoaded(uniqueProducts, dataSource);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        
        // Fallback to empty products array on error
        onProductsLoaded([], "local");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [selectedCategory, onProductsLoaded]);

  return { isLoading, error };
};

/**
 * Load products from all available sources (local and WooCommerce)
 */
const loadProductsFromAllSources = async (
  selectedCategory: string, 
  alreadyLoaded: boolean
): Promise<{
  allProducts: Product[];
  dataSource: DataSource;
}> => {
  // Array to hold products from all sources
  let allProducts: Product[] = [];
  let dataSource: DataSource = "local";
  let wooCommerceProductCount = 0;
  
  // Always load local products first
  try {
    const { getProductsByCategory } = await import('@/data/products');
    const dataProducts = getProductsByCategory(selectedCategory);
    
    if (dataProducts && dataProducts.length > 0) {
      console.log(`Loaded ${dataProducts.length} local products`);
      
      // Process data directory products
      const processedDataProducts = dataProducts.map(product => {
        // Ensure images is an array and fix paths
        const fixedImages = (product.images || []).map(img => {
          if (img.startsWith("public/")) {
            return img.replace("public/", "/");
          }
          return img.startsWith("/") ? img : `/${img}`;
        });
        
        // Convert to Product type to ensure compatibility
        return {
          ...product,
          image: fixedImages[0] || "/placeholder.svg", // Add required image property
          images: fixedImages.length > 0 ? fixedImages : ["/placeholder.svg"]
        } as Product;
      });
      
      // Add local products to the combined list
      allProducts = [...processedDataProducts];
      dataSource = "local";
    }
  } catch (importError) {
    console.error("Error importing local products:", importError);
  }
  
  // Try to fetch products from WooCommerce if configured
  if (isWooCommerceConfigured()) {
    console.log("Fetching products from WooCommerce integration");
    
    try {
      const wooProducts = await fetchWooCommerceProducts();
      
      if (wooProducts && wooProducts.length > 0) {
        console.log(`Fetched ${wooProducts.length} products from WooCommerce`);
        
        // Add WooCommerce products to combined list
        allProducts = [...allProducts, ...wooProducts];
        wooCommerceProductCount = wooProducts.length;
        
        // Update data source indicator
        if (dataSource === "local" && wooCommerceProductCount > 0) {
          dataSource = "combined";
        } else if (allProducts.length === wooCommerceProductCount) {
          dataSource = "woocommerce";
        }
        
        // Show toast notification on successful load
        if (!alreadyLoaded) {
          toast.success(`Loaded ${wooProducts.length} products from WooCommerce`);
        }
      } else {
        console.log("No products found in WooCommerce");
      }
    } catch (wooError) {
      console.error("Error fetching WooCommerce products:", wooError);
      if (!alreadyLoaded) {
        toast.error("Failed to load WooCommerce products");
      }
    }
  } else {
    console.log("WooCommerce is not configured");
  }
  
  // Filter combined products by selected category
  let filteredProducts = filterProductsByCategory(allProducts, selectedCategory);
  
  return { allProducts: filteredProducts, dataSource };
};

/**
 * Filter products by category
 */
const filterProductsByCategory = (products: Product[], selectedCategory: string): Product[] => {
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
const removeDuplicateProducts = (products: Product[]): Product[] => {
  return Array.from(
    new Map(products.map(item => [item.id, item])).values()
  );
};
