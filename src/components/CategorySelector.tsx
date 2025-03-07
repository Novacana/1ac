
import React from "react";
import CategoryPill from "@/components/CategoryPill";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section className="py-0 border-b border-border/20">
      <div className="container">
        <div className="overflow-x-auto scrollbar-none py-2">
          <div className="flex items-center gap-3 justify-center md:justify-start min-w-max px-2">
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

export default CategorySelector;
