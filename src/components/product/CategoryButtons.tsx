
import React from "react";
import CategoryPill from "@/components/CategoryPill";
import { cn } from "@/lib/utils";

interface CategoryButtonsProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryButtons: React.FC<CategoryButtonsProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  // Make sure "All" is the first category
  const sortedCategories = ["All", ...categories.filter(c => c !== "All")];

  return (
    <section className="py-0 border-b border-border/20 w-full">
      <div className="w-full max-w-screen-2xl mx-auto">
        <div className="overflow-x-auto scrollbar-none py-2">
          <div className="flex items-center gap-3 justify-center min-w-max px-6">
            {sortedCategories.map((category, index) => (
              <CategoryPill
                key={category || `category-${index}`}
                label={category || "Other"}
                active={selectedCategory === category}
                onClick={() => onCategoryChange(category)}
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

export default CategoryButtons;
