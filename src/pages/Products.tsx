
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { products } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import EmptyProductState from "@/components/EmptyProductState";
import { toast } from "sonner";
import Filters, { FilterOptions } from "@/components/home/Filters";
import { Product } from "@/types/product";
import { ProductDetailProps } from "@/components/ProductDetail";

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  
  // Get max price from all products for slider range
  const maxPrice = Math.ceil(Math.max(...products.map(p => typeof p.price === 'number' ? p.price : 0)));
  
  // Initialize filters
  const [filters, setFilters] = useState<FilterOptions>({
    thcRange: [0, 30],
    priceRange: [0, maxPrice],
    sortBy: 'popularity'
  });

  useEffect(() => {
    // Convert ProductDetailProps to Product type
    const convertedProducts = products.map(product => {
      // Ensure images is an array and fix paths
      const fixedImages = (product.images || []).map(img => {
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
    
    setAllProducts(convertedProducts);
    setFilteredProducts(convertedProducts);
    
    // Pre-load images to check for errors
    convertedProducts.forEach(product => {
      const imagePath = getImagePath(product);
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => ({...prev, [product.id]: true}));
      };
      img.onerror = () => {
        console.error(`Failed to load image for product ${product.id}: ${imagePath}`);
        // Don't toast as it would create too many notifications
      };
      img.src = imagePath;
    });
  }, []);

  // Helper function to parse THC percentage to number
  const parseThcPercentage = (thcStr?: string): number => {
    if (!thcStr) return 0;
    
    // Handle ranges like "10-15%"
    if (thcStr.includes("-")) {
      const parts = thcStr.split("-");
      const avg = parts.map(p => parseFloat(p)).reduce((a, b) => a + b, 0) / parts.length;
      return avg;
    }
    
    // Handle "< 0.2%" format
    if (thcStr.includes("<")) {
      return 0.1; // Just a small value for "less than" cases
    }
    
    // Handle "X% per piece" format
    if (thcStr.includes("per piece")) {
      return parseFloat(thcStr) || 0;
    }
    
    // Regular percentage
    return parseFloat(thcStr) || 0;
  };

  // Apply filters
  useEffect(() => {
    let result = allProducts.filter(product => {
      // Filter by price
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Filter by THC (skip for accessories which don't have THC)
      if (product.category !== "Accessories" && product.category !== "Zubehör") {
        const thcValue = parseThcPercentage(product.thc);
        if (thcValue < filters.thcRange[0] || thcValue > filters.thcRange[1]) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'thc-desc':
        result.sort((a, b) => parseThcPercentage(b.thc) - parseThcPercentage(a.thc));
        break;
      case 'popularity':
        // We don't have real popularity data, so we'll just use the original order
        break;
    }
    
    setFilteredProducts(result);
  }, [allProducts, filters]);
  
  // Reset filters to defaults
  const handleResetFilters = () => {
    setFilters({
      thcRange: [0, 30],
      priceRange: [0, maxPrice],
      sortBy: 'popularity'
    });
  };

  if (!filteredProducts || filteredProducts.length === 0) {
    return <EmptyProductState message="Keine Produkte gefunden" />;
  }

  // Helper function to get correct image path
  const getImagePath = (product: any) => {
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Unsere Produkte</h1>
        
        <Filters 
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          maxPrice={maxPrice}
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          {filteredProducts.map((product) => {
            const imagePath = getImagePath(product);
            
            return (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <div className="absolute inset-0 bg-card/20 flex items-center justify-center z-10 transition-opacity duration-300" 
                           style={{opacity: imagesLoaded[product.id] ? 0 : 1}}>
                        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
                      </div>
                      <img 
                        src={imagePath}
                        alt={product.name}
                        className="w-full h-full object-cover z-0"
                        onLoad={() => {
                          console.log(`Image loaded successfully for ${product.name}`);
                          setImagesLoaded(prev => ({...prev, [product.id]: true}));
                        }}
                        onError={(e) => {
                          console.error(`Error loading image for ${product.name}:`, e.currentTarget.src);
                          toast.error(`Bild für ${product.name} konnte nicht geladen werden`);
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                          setImagesLoaded(prev => ({...prev, [product.id]: true}));
                        }}
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
                      <p className="font-medium text-sm">{product.price.toFixed(2)} €</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
