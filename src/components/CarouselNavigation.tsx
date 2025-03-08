
import React from "react";

interface CarouselNavigationProps {
  activeIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  activeIndex,
  totalItems,
  onDotClick
}) => {
  if (totalItems <= 0) return null;

  return (
    <div className="flex justify-center mt-4">
      {Array.from({ length: totalItems }).map((_, index) => (
        <button
          key={index}
          onClick={() => onDotClick(index)}
          className={`h-2 w-2 mx-1 rounded-full transition-all ${
            index === activeIndex ? "bg-primary w-4" : "bg-gray-400"
          }`}
          aria-label={`Gehe zu Produkt ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default CarouselNavigation;
