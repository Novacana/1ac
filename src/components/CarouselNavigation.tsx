
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  onPrevious,
  onNext,
  onDotClick
}) => {
  if (totalItems <= 0) return null;

  return (
    <>
      <div className="hidden md:flex absolute inset-y-0 left-8 items-center">
        <button 
          onClick={onPrevious}
          className="bg-primary/80 text-white rounded-full p-2 hover:bg-primary transition-colors"
          aria-label="Vorheriges Produkt"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      
      <div className="hidden md:flex absolute inset-y-0 right-8 items-center">
        <button 
          onClick={onNext}
          className="bg-primary/80 text-white rounded-full p-2 hover:bg-primary transition-colors"
          aria-label="Nächstes Produkt"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

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
    </>
  );
};

export default CarouselNavigation;
