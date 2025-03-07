
import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, Float, Text, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import { Product } from "@/types/product";

interface ProductModelProps {
  product: Product;
  index: number;
  totalProducts: number;
}

// Individual product model
const ProductModel: React.FC<ProductModelProps> = ({ product, index, totalProducts }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const textureLoader = new THREE.TextureLoader();
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  // Calculate position on the circle
  const angle = (index / totalProducts) * Math.PI * 2;
  const radius = 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  
  // Load texture if it's a flower
  React.useEffect(() => {
    if (product.category === "Flowers") {
      textureLoader.load(product.image, (loadedTexture) => {
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.repeat.set(1, 1);
        setTexture(loadedTexture);
        setLoaded(true);
      });
    }
  }, [product.image, product.category]);
  
  // Rotate the product
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getGeometryForCategory = (category: string) => {
    switch(category) {
      case "Flowers":
        return new THREE.IcosahedronGeometry(1, 2); // More detailed for flowers
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

  const getMaterialForCategory = (category: string) => {
    if (category === "Flowers" && texture) {
      return new THREE.MeshStandardMaterial({ 
        map: texture,
        roughness: 0.5,
        metalness: 0.2
      });
    }
    
    // Default color materials for other categories
    const color = getColorForCategory(category);
    return new THREE.MeshStandardMaterial({ 
      color: color,
      roughness: 0.3,
      metalness: 0.7,
      envMapIntensity: 1.5
    });
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

  return (
    <group position={[x, 0, z]} rotation={[0, -angle, 0]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh 
          ref={meshRef}
          geometry={getGeometryForCategory(product.category)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.1 : 1}
        >
          {product.category === "Flowers" && texture ? (
            <meshStandardMaterial 
              map={texture}
              roughness={0.5}
              metalness={0.2}
            />
          ) : (
            <meshStandardMaterial 
              color={getColorForCategory(product.category)}
              roughness={0.3}
              metalness={0.7}
              envMapIntensity={1.5}
            />
          )}
        </mesh>
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {product.name}
        </Text>
        <Text
          position={[0, -1.9, 0]}
          fontSize={0.2}
          color="#bae3bc"
          anchorX="center"
          anchorY="middle"
        >
          €{product.price.toFixed(2)}
        </Text>
      </Float>
    </group>
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
  
  return (
    <div className="w-full h-[600px] my-8">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 35 }}>
        <color attach="background" args={['#010409']} />
        <fog attach="fog" args={['#010409', 10, 20]} />
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
          <group rotation={[0, 0, 0]}>
            {filteredProducts.map((product, index) => (
              <ProductModel 
                key={product.id} 
                product={product} 
                index={index} 
                totalProducts={filteredProducts.length} 
              />
            ))}
          </group>
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default ProductCarousel;
