
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// Define the product type for TypeScript
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  thc?: string;
  cbd?: string;
  category: string;
}

interface ProductItemProps {
  product: Product;
  index: number;
  totalItems: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  radius: number;
}

// Each product displayed as a 3D card with image texture
const ProductItem = ({ product, index, totalItems, activeIndex, setActiveIndex, radius }: ProductItemProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const isActive = activeIndex === index;
  
  // Load product image as texture
  const texture = useTexture(product.image);
  
  // Calculate position on the circle
  const angle = (index / totalItems) * Math.PI * 2;
  const targetX = Math.sin(angle) * radius;
  const targetZ = Math.cos(angle) * radius;
  
  // Rotate the item over time
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Smooth movement to target position
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.1;
    meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.1;
    
    // Make the card always face the center
    meshRef.current.rotation.y = Math.atan2(meshRef.current.position.x, meshRef.current.position.z);
    
    // Add a gentle floating animation to active card
    if (isActive) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 + 0.2;
      meshRef.current.scale.set(1.2, 1.2, 1.2);
    } else {
      meshRef.current.position.y = 0;
      meshRef.current.scale.set(1, 1, 1);
    }
    
    // Add slight rotation animation
    if (hovered || isActive) {
      meshRef.current.rotation.z = THREE.MathUtils.lerp(
        meshRef.current.rotation.z,
        isActive ? Math.sin(state.clock.elapsedTime * 3) * 0.1 : 0,
        0.1
      );
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={[targetX, 0, targetZ]}
      onClick={() => setActiveIndex(index)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Card base */}
      <boxGeometry args={[2, 3, 0.1]} />
      <meshStandardMaterial 
        color={isActive ? "#3a9a40" : hovered ? "#5db462" : "#ffffff"}
        metalness={0.2}
        roughness={0.7}
      />
      
      {/* Product image */}
      <mesh position={[0, 0.5, 0.06]}>
        <planeGeometry args={[1.8, 1.8]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>
      
      {/* Product name */}
      <Text
        position={[0, -0.8, 0.06]}
        fontSize={0.2}
        maxWidth={1.8}
        color={isActive ? "#ffffff" : "#000000"}
        anchorX="center"
        anchorY="middle"
      >
        {product.name}
      </Text>
      
      {/* Product price */}
      <Text
        position={[0, -1.2, 0.06]}
        fontSize={0.25}
        color={isActive ? "#ffffff" : "#3a9a40"}
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
      >
        €{product.price.toFixed(2)}
      </Text>
    </mesh>
  );
};

// Rotating cannabis decoration items
const CannabisLeaf = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.7) * 0.2;
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <torusKnotGeometry args={[0.3, 0.1, 64, 8, 2, 3]} />
      <meshStandardMaterial color="#2b7e31" metalness={0.2} roughness={0.8} />
    </mesh>
  );
};

// Main carousel component
interface ProductCarousel3DProps {
  products: Product[];
  className?: string;
}

const ProductCarousel3D: React.FC<ProductCarousel3DProps> = ({ products, className }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const radius = 5; // Radius of the carousel circle
  
  // Auto-rotate the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [products.length]);
  
  // Mobile friendly touch controls for carousel
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      const touchStartX = e.touches[0].clientX;
      
      const handleTouchMove = (e: TouchEvent) => {
        const touchMoveX = e.touches[0].clientX;
        const diff = touchStartX - touchMoveX;
        
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            // Swipe left
            setActiveIndex((prev) => (prev + 1) % products.length);
          } else {
            // Swipe right
            setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
          }
          
          // Remove move handler after swipe is detected
          canvasRef.current?.removeEventListener("touchmove", handleTouchMove);
        }
      };
      
      canvasRef.current?.addEventListener("touchmove", handleTouchMove);
      
      const handleTouchEnd = () => {
        canvasRef.current?.removeEventListener("touchmove", handleTouchMove);
        canvasRef.current?.removeEventListener("touchend", handleTouchEnd);
      };
      
      canvasRef.current?.addEventListener("touchend", handleTouchEnd);
    };
    
    canvasRef.current?.addEventListener("touchstart", handleTouchStart);
    
    return () => {
      canvasRef.current?.removeEventListener("touchstart", handleTouchStart);
    };
  }, [products.length]);
  
  return (
    <div className={cn("relative w-full h-[500px]", className)}>
      <Canvas ref={canvasRef}>
        {/* Camera setup */}
        <PerspectiveCamera makeDefault position={[0, 2, 8]} />
        
        {/* Scene lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        
        {/* Products in carousel */}
        {products.map((product, index) => (
          <ProductItem
            key={product.id}
            product={product}
            index={index}
            totalItems={products.length}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            radius={radius}
          />
        ))}
        
        {/* Decorative cannabis elements */}
        <CannabisLeaf position={[2, 3, -3]} />
        <CannabisLeaf position={[-2, 2, -2]} />
        <CannabisLeaf position={[0, 4, -4]} />
      </Canvas>
      
      {/* Navigation dots */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              activeIndex === index ? "bg-primary w-6" : "bg-primary/30"
            )}
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel3D;
