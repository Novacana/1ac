
import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PresentationControls } from "@react-three/drei";
import { Product } from "@/types/product";
import ProductInfoPanel from "./ProductInfoPanel";
import ProductModel from "./product/ProductModel";
import CarouselNavigation from "./product/CarouselNavigation";
import EmptyProductState from "./product/EmptyProductState";

interface ProductCarouselProps {
  products: Product[];
  selectedCategory: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, selectedCategory }) => {
  const filteredProducts = products.filter(product => product.category === selectedCategory);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
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
  };

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  const goToNext = () => {
    setActiveIndex(prev => (prev === filteredProducts.length - 1 ? 0 : prev + 1));
  };

  const goToPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? filteredProducts.length - 1 : prev - 1));
  };

  if (filteredProducts.length === 0) {
    return <EmptyProductState />;
  }

  const activeProduct = filteredProducts[activeIndex];

  return (
    <div className="w-full relative">
      <ProductInfoPanel product={activeProduct} />
      
      <div 
        ref={canvasRef} 
        className="w-full h-[400px] md:h-[500px] touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 35 }}>
          <color attach="background" args={['#0000']} />
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

      <CarouselNavigation 
        totalItems={filteredProducts.length}
        activeIndex={activeIndex}
        onIndexChange={setActiveIndex}
        onNext={goToNext}
        onPrevious={goToPrevious}
      />
    </div>
  );
};

export default ProductCarousel;
