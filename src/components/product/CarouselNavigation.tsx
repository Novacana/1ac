
import React from "react";

interface CarouselNavigationProps {
  totalItems: number;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({ 
  totalItems, 
  activeIndex, 
  onIndexChange,
  onNext,
  onPrevious
}) => {
  return (
    <>
      <div className="hidden md:flex absolute inset-y-0 left-4 items-center">
        <button 
          onClick={onPrevious}
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
          onClick={onNext}
          className="bg-primary/80 text-white rounded-full p-2 hover:bg-primary transition-colors"
          aria-label="Next product"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalItems }).map((_, index) => (
          <button
            key={index}
            onClick={() => onIndexChange(index)}
            className={`h-2 w-2 mx-1 rounded-full transition-all ${
              index === activeIndex ? "bg-primary w-4" : "bg-gray-400"
            }`}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </>
  );
};

export default CarouselNavigation;
