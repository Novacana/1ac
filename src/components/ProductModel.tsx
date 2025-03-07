
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
  
  // Reduce the position spread to make models closer together
  const position: [number, number, number] = isActive 
    ? [0, 0, 0] 
    : [isActive ? 0 : index > 0 ? 3 : -3, 0, 0];
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const getGeometryForCategory = (category: string) => {
    switch(category) {
      case "Flowers":
      case "Blüten":
        return new THREE.IcosahedronGeometry(0.8, 1); // Made smaller
      case "Oils":
      case "Öle":
        return new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32); // Made smaller
      case "Vapes":
        return new THREE.CylinderGeometry(0.25, 0.25, 1.6, 16); // Made smaller
      case "Topicals":
        return new THREE.BoxGeometry(0.8, 0.4, 0.8); // Made smaller
      case "Edibles":
        return new THREE.TorusGeometry(0.4, 0.15, 16, 32); // Made smaller
      case "Accessories":
      case "Zubehör":
        return new THREE.TorusKnotGeometry(0.4, 0.15, 64, 16); // Made smaller
      default:
        return new THREE.SphereGeometry(0.8, 32, 32); // Made smaller
    }
  };

  const getColorForCategory = (category: string) => {
    // Make the materials more transparent to see through them
    const materialColor = new THREE.Color(getCategoryColor(category));
    return materialColor;
  };

  const getCategoryColor = (category: string): string => {
    switch(category) {
      case "Flowers":
      case "Blüten":
        return "#3a9a40";
      case "Oils":
      case "Öle":
        return "#5db462";
      case "Vapes":
        return "#8fcf93";
      case "Topicals":
        return "#bae3bc";
      case "Edibles":
        return "#2b7e31";
      case "Accessories":
      case "Zubehör":
        return "#24632a";
      default:
        return "#3a9a40";
    }
  };

  // Reduce the scale values to make models smaller
  const scale = isActive ? (hovered ? 0.9 : 0.8) : 0.6;

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
          metalness={0.6}
          envMapIntensity={1.2}
          transparent={true}
          opacity={0.8} // Add transparency to see through the models
        />
      </mesh>
    </Float>
  );
};

export default ProductModel;
