
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategoryChange,
  categories,
}) => {
  return (
    <Select
      value={selectedCategory}
      onValueChange={onCategoryChange}
    >
      <SelectTrigger className="w-full h-9">
        <SelectValue placeholder="Kategorie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">Alle Kategorien</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {category}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CategorySelector;
