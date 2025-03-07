
import React, { useEffect, useState } from "react";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/types/product";
import { FilterX } from "lucide-react";

interface CarouselSectionProps {
  products: Product[];
  selectedCategory: string;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ products, selectedCategory }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  // Handle loading state
  if (isLoading) {
    return (
      <section className="py-2 relative">
        <div className="container px-4 mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // Handle empty state
  if (!products || products.length === 0) {
    return (
      <section className="py-2 relative">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FilterX className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">Keine Produkte gefunden</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Es wurden keine Produkte gefunden, die Ihren Filterkriterien entsprechen. Bitte passen Sie Ihre Filter an oder wählen Sie eine andere Kategorie.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-2 relative">
      <div className="container px-4 mx-auto">
        <ProductCarousel products={products} selectedCategory={selectedCategory} />
      </div>
    </section>
  );
};

export default CarouselSection;
