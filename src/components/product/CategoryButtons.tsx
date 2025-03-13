
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
    <div className="w-full mb-4 border-b border-border/20 pb-3">
      <div className="flex items-center justify-start gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
        {sortedCategories.map((category, index) => (
          <CategoryPill
            key={category || `category-${index}`}
            label={category || "Other"}
            active={selectedCategory === category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "animate-scale-in",
              selectedCategory === category ? "shadow-md" : ""
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryButtons;
