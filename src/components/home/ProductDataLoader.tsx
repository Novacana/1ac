
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { 
  fetchWooCommerceProducts, 
  isWooCommerceConfigured, 
  getCategoryMapping 
} from "@/utils/woocommerce";

interface ProductDataLoaderProps {
  selectedCategory: string;
  onProductsLoaded: (products: Product[]) => void;
}

const ProductDataLoader: React.FC<ProductDataLoaderProps> = ({ 
  selectedCategory, 
  onProductsLoaded 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if WooCommerce is configured first
        if (isWooCommerceConfigured()) {
          console.log("Using WooCommerce integration to fetch products");
          
          // Fetch products from WooCommerce
          const wooProducts = await fetchWooCommerceProducts();
          
          if (wooProducts && wooProducts.length > 0) {
            console.log(`Fetched ${wooProducts.length} products from WooCommerce`);
            
            // Filter products by selected category
            const filteredProducts = wooProducts.filter(product => {
              const productCategory = product.category;
              const normalizedCategory = selectedCategory;
              
              // Check if the product category matches the selected category or its mapping
              return (
                productCategory === normalizedCategory ||
                getCategoryMapping(productCategory) === normalizedCategory
              );
            });
            
            console.log(`Filtered to ${filteredProducts.length} products for category ${selectedCategory}`);
            onProductsLoaded(filteredProducts);
            setIsLoading(false);
            return;
          } else {
            console.log("No products found in WooCommerce, falling back to local data");
          }
        }
        
        // Fallback to local data if WooCommerce is not configured or returns no products
        import('@/data/products').then(({ getProductsByCategory }) => {
          const dataProducts = getProductsByCategory(selectedCategory);
          
          if (dataProducts && dataProducts.length > 0) {
            console.log("Using products from data directory:", dataProducts.length);
            
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
            
            onProductsLoaded(processedDataProducts);
          } else {
            console.log("No products found for category:", selectedCategory);
            onProductsLoaded([]);
          }
          
          setIsLoading(false);
        });
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        
        // Fallback to empty products array on error
        onProductsLoaded([]);
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [selectedCategory, onProductsLoaded]);

  if (error) {
    console.error("Product loading error:", error);
  }

  return null; // This is a logic-only component, no UI rendering
};

export default ProductDataLoader;
