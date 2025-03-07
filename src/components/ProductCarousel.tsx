
import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PresentationControls } from "@react-three/drei";
import { Product } from "@/types/product";
import ProductInfoPanel from "./ProductInfoPanel"; 
import ProductModel from "./ProductModel";
import CarouselNavigation from "./CarouselNavigation";
import EmptyProductState from "./EmptyProductState";
import { products as productsData } from "@/data/products";

interface ProductCarouselProps {
  products?: Product[];
  selectedCategory: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ 
  products = productsData, 
  selectedCategory 
}) => {
  console.log("ProductCarousel - selectedCategory:", selectedCategory);
  console.log("ProductCarousel - products:", products);
  
  // Normalize English and German category names
  const categoryMap: Record<string, string> = {
    "Flowers": "Blüten",
    "Oils": "Öle",
    "Edibles": "Esswaren",
    "Topicals": "Topicals",
    "Vapes": "Vapes",
    "Accessories": "Zubehör"
  };
  
  const normalizedCategory = categoryMap[selectedCategory] || selectedCategory;
  
  const filteredProducts = products.filter(product => {
    const productCategory = product.category;
    return productCategory === normalizedCategory || 
           productCategory === selectedCategory || 
           categoryMap[productCategory] === selectedCategory;
  });
  
  console.log("ProductCarousel - filteredProducts:", filteredProducts);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    // If the user has moved more than 10px, consider it a swipe
    if (Math.abs(e.touches[0].clientX - startX.current) > 10) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || !isSwiping) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = endX - startX.current;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    startX.current = null;
    setIsSwiping(false);
  };

  // Navigation functions
  const goToNext = () => {
    setActiveIndex(prev => (prev === filteredProducts.length - 1 ? 0 : prev + 1));
  };

  const goToPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? filteredProducts.length - 1 : prev - 1));
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
  };

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  // If no products, show empty state
  if (filteredProducts.length === 0) {
    return <EmptyProductState />;
  }

  const activeProduct = filteredProducts[activeIndex];

  return (
    <div className="w-full relative">
      {/* Move the product info panel outside the touch area on mobile */}
      <div className="hidden md:block">
        {activeProduct && <ProductInfoPanel product={activeProduct} />}
      </div>
      
      <div 
        ref={canvasRef} 
        className="w-full h-[400px] md:h-[500px] touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 35 }}>
          <color attach="background" args={['#ffffff00']} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
          >
            <group>
              {filteredProducts.map((product, index) => (
                <ProductModel 
                  key={product.id} 
                  product={product} 
                  isActive={index === activeIndex}
                  index={index - activeIndex} 
                />
              ))}
            </group>
          </PresentationControls>
          <Environment preset="city" />
        </Canvas>
      </div>

      {/* Show the product info panel below the carousel on mobile */}
      <div className="md:hidden mt-4 px-4">
        {activeProduct && <ProductInfoPanel product={activeProduct} />}
      </div>

      <CarouselNavigation
        activeIndex={activeIndex}
        totalItems={filteredProducts.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onDotClick={goToIndex}
      />
    </div>
  );
};

export default ProductCarousel;
