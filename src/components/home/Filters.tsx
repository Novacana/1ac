
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { useProductSuggestions } from "@/hooks/useProductSuggestions";

export interface FilterOptions {
  thcRange: [number, number];
  priceRange: [number, number];
  sortBy: string;
}

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
  maxPrice: number;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  maxPrice,
  categories,
  selectedCategory,
  onCategoryChange,
  searchQuery = "",
  onSearchChange = () => {},
}) => {
  const updateThcRange = (value: number[]) => {
    onFilterChange({
      ...filters,
      thcRange: [value[0], value[1]] as [number, number],
    });
  };

  const updatePriceRange = (value: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: [value[0], value[1]] as [number, number],
    });
  };

  const { suggestions } = useProductSuggestions();

  const handleSearch = (query: string) => {
    onSearchChange(query);
  };

  return (
    <div className="bg-background/60 backdrop-blur-sm p-4 rounded-lg mb-6 shadow-sm border border-border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* Search field with autocomplete - now more compact */}
        <div className="col-span-1">
          <SearchAutocomplete
            suggestions={suggestions}
            onSearch={handleSearch}
            placeholder="Suche..."
            fullWidth
            maxSuggestions={5}
            compact={true}
            className="min-w-[150px]"
          />
        </div>

        {/* Category selector */}
        <div>
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
        </div>

        {/* Sort selector */}
        <div>
          <Select
            value={filters.sortBy}
            onValueChange={(value) =>
              onFilterChange({
                ...filters,
                sortBy: value,
              })
            }
          >
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Sortieren" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Beliebtheit</SelectItem>
              <SelectItem value="price-asc">Preis: Aufsteigend</SelectItem>
              <SelectItem value="price-desc">Preis: Absteigend</SelectItem>
              <SelectItem value="thc-desc">THC: Höchster zuerst</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-9 text-xs px-2"
          >
            Filter zurücksetzen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* THC Range */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">THC Gehalt (%)</label>
            <span className="text-sm text-muted-foreground">
              {filters.thcRange[0]}% - {filters.thcRange[1]}%
            </span>
          </div>
          <Slider
            defaultValue={[0, 30]}
            value={[filters.thcRange[0], filters.thcRange[1]]}
            max={30}
            step={1}
            onValueChange={updateThcRange}
            className="mb-4"
          />
        </div>

        {/* Price Range */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Preis (€)</label>
            <span className="text-sm text-muted-foreground">
              {filters.priceRange[0]}€ - {filters.priceRange[1]}€
            </span>
          </div>
          <Slider
            defaultValue={[0, maxPrice]}
            value={[filters.priceRange[0], filters.priceRange[1]]}
            max={maxPrice}
            step={1}
            onValueChange={updatePriceRange}
            className="mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default Filters;
