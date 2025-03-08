
import { useState, useRef } from "react";

export const useSwipeHandling = () => {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  
  const startX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(false);
    setHasMoved(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const distance = currentX - startX.current;
    setSwipeDistance(distance);
    
    if (Math.abs(distance) > 10) {
      setIsSwiping(true);
      setHasMoved(true);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setTouchStartX(e.clientX);
    setIsSwiping(true);
    setHasMoved(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping || startX.current === null) return;
    
    const distance = e.clientX - startX.current;
    setSwipeDistance(distance);
    
    if (Math.abs(distance) > 10) {
      setHasMoved(true);
    }
  };

  const handleMouseUp = () => {
    startX.current = null;
    setIsSwiping(false);
    setSwipeDistance(0);
  };

  const handleMouseLeave = () => {
    if (isSwiping) {
      setIsSwiping(false);
      setSwipeDistance(0);
      startX.current = null;
    }
  };

  return {
    touchStartX,
    touchEndX,
    swipeDistance,
    isSwiping,
    hasMoved,
    startX,
    containerRef,
    handleTouchStart,
    handleTouchMove,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    setHasMoved
  };
};
