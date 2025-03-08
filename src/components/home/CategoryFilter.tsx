
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
    <section className="py-2 border-b border-border/10 bg-gradient-to-r from-background to-secondary/10">
      <div className="container">
        <div className="overflow-x-auto scrollbar-none py-3">
          <div className="flex items-center gap-4 justify-center min-w-max px-4">
            {categories.map((category, index) => (
              <CategoryPill
                key={category}
                label={category}
                active={selectedCategory === category}
                onClick={() => onSelectCategory(category)}
                className="animate-scale-in shadow-sm"
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
