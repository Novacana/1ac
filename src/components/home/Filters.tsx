
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { useProductSuggestions } from "@/hooks/useProductSuggestions";
import { FilterIcon, SlidersHorizontal } from "lucide-react";

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

// Constants for filter limits
const MAX_THC = 30;
const MAX_PRICE_LIMIT = 500; // Set a reasonable upper price limit

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
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  
  // Use the smaller of maxPrice from products or MAX_PRICE_LIMIT
  const effectiveMaxPrice = Math.min(maxPrice || MAX_PRICE_LIMIT, MAX_PRICE_LIMIT);

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
    <div className="bg-background/60 backdrop-blur-sm p-3 rounded-lg mb-6 shadow-sm border border-border">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
        {/* Search field with autocomplete - now more compact */}
        <div className="col-span-1 md:col-span-2">
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
        <div className="col-span-1">
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
        <div className="col-span-1">
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

        {/* Advanced Filters Dropdown */}
        <div className="col-span-1">
          <DropdownMenu open={filterDropdownOpen} onOpenChange={setFilterDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full h-9">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 p-4" align="end">
              <div className="space-y-4">
                {/* THC Range */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium">THC Gehalt (%)</label>
                    <span className="text-sm text-muted-foreground">
                      {filters.thcRange[0]}% - {filters.thcRange[1]}%
                    </span>
                  </div>
                  <Slider
                    defaultValue={[0, MAX_THC]}
                    value={[filters.thcRange[0], filters.thcRange[1]]}
                    max={MAX_THC}
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
                    defaultValue={[0, effectiveMaxPrice]}
                    value={[filters.priceRange[0], filters.priceRange[1]]}
                    max={effectiveMaxPrice}
                    step={1}
                    onValueChange={updatePriceRange}
                    className="mb-2"
                  />
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Reset Button */}
        <div className="col-span-1">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="w-full h-9"
          >
            Zurücksetzen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
