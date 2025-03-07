
import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import { Product } from "@/types/product";

interface ProductModelProps {
  product: Product;
  isActive: boolean;
  index: number;
}

// Individual product model
const ProductModel: React.FC<ProductModelProps> = ({ product, isActive, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Position the product at the center when active, otherwise to the side
  const position: [number, number, number] = isActive 
    ? [0, 0, 0] 
    : [isActive ? 0 : index > 0 ? 5 : -5, 0, 0];
  
  // Rotate the product
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getGeometryForCategory = (category: string) => {
    switch(category) {
      case "Flowers":
        return new THREE.IcosahedronGeometry(1, 1);
      case "Oils":
        return new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32);
      case "Vapes":
        return new THREE.CylinderGeometry(0.3, 0.3, 2, 16);
      case "Topicals":
        return new THREE.BoxGeometry(1, 0.5, 1);
      case "Edibles":
        return new THREE.TorusGeometry(0.5, 0.2, 16, 32);
      case "Accessories":
        return new THREE.TorusKnotGeometry(0.5, 0.2, 64, 16);
      default:
        return new THREE.SphereGeometry(1, 32, 32);
    }
  };

  const getColorForCategory = (category: string) => {
    switch(category) {
      case "Flowers":
        return new THREE.Color("#3a9a40");
      case "Oils":
        return new THREE.Color("#5db462");
      case "Vapes":
        return new THREE.Color("#8fcf93");
      case "Topicals":
        return new THREE.Color("#bae3bc");
      case "Edibles":
        return new THREE.Color("#2b7e31");
      case "Accessories":
        return new THREE.Color("#24632a");
      default:
        return new THREE.Color("#3a9a40");
    }
  };

  // Scale up active product
  const scale = isActive ? (hovered ? 1.15 : 1.05) : 0.8;

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh 
        ref={meshRef}
        geometry={getGeometryForCategory(product.category)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={scale}
        position={position}
      >
        <meshStandardMaterial 
          color={getColorForCategory(product.category)}
          roughness={0.3}
          metalness={0.7}
          envMapIntensity={1.5}
        />
      </mesh>
    </Float>
  );
};

interface ProductCarouselProps {
  products: Product[];
  selectedCategory: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, selectedCategory }) => {
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);

  // Handle swipe gesture
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
    
    // Determine swipe direction based on distance moved
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe right (previous)
        setActiveIndex(prev => (prev === 0 ? filteredProducts.length - 1 : prev - 1));
      } else {
        // Swipe left (next)
        setActiveIndex(prev => (prev === filteredProducts.length - 1 ? 0 : prev + 1));
      }
    }
    
    startX.current = null;
  };

  // Reset active index when filtered products change
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  // Handle manual navigation
  const goNext = () => {
    setActiveIndex(prev => (prev === filteredProducts.length - 1 ? 0 : prev + 1));
  };

  const goPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? filteredProducts.length - 1 : prev - 1));
  };

  // If no products match the filter
  if (filteredProducts.length === 0) {
    return (
      <div className="w-full h-[400px] flex items-center justify-center">
        <p className="text-xl text-muted-foreground">No products found in this category</p>
      </div>
    );
  }

  return (
    <div className="w-full relative">
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

      {/* Navigation buttons for desktop */}
      <div className="hidden md:flex absolute inset-y-0 left-4 items-center">
        <button 
          onClick={goPrevious}
          className="bg-primary/80 text-white rounded-full p-2 hover:bg-primary transition-colors"
          aria-label="Previous product"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="hidden md:flex absolute inset-y-0 right-4 items-center">
        <button 
          onClick={goNext}
          className="bg-primary/80 text-white rounded-full p-2 hover:bg-primary transition-colors"
          aria-label="Next product"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center mt-4">
        {filteredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 mx-1 rounded-full transition-all ${
              index === activeIndex ? "bg-primary w-4" : "bg-gray-400"
            }`}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
