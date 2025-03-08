
import React from "react";
import CategoryPill from "@/components/CategoryPill";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory 
}) => {
  return (
    <section className="py-0 border-b border-border/20 w-full">
      <div className="w-full max-w-screen-2xl mx-auto">
        <div className="overflow-x-auto scrollbar-none py-2">
          <div className="flex items-center gap-3 justify-center min-w-max px-6">
            {categories.map((category, index) => (
              <CategoryPill
                key={category}
                label={category}
                active={selectedCategory === category}
                onClick={() => onSelectCategory(category)}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryFilter;
