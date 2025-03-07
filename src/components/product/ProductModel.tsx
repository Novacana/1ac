
import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { Product } from "@/types/product";

interface ProductModelProps {
  product: Product;
  isActive: boolean;
  index: number;
}

const ProductModel: React.FC<ProductModelProps> = ({ product, isActive, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const position: [number, number, number] = isActive 
    ? [0, 0, 0] 
    : [isActive ? 0 : index > 0 ? 5 : -5, 0, 0];
  
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

export default ProductModel;
