
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { products } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import EmptyProductState from "@/components/EmptyProductState";
import { toast } from "sonner";

const Products = () => {
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  
  useEffect(() => {
    // Pre-load images to check for errors
    products.forEach(product => {
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

  if (!products || products.length === 0) {
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
        <h1 className="text-3xl font-bold mb-8">Unsere Produkte</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => {
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
