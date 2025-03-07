
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  FilterX,
  DollarSign,
  Leaf,
  ArrowDownAZ,
  ArrowDownZA,
  Flame,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type FilterOptions = {
  thcRange: [number, number];
  priceRange: [number, number];
  sortBy: 'price-asc' | 'price-desc' | 'thc-desc' | 'popularity';
  category?: string;
};

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
  maxPrice: number;
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onReset,
  maxPrice,
  categories = [],
  selectedCategory = "All",
  onCategoryChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Constants for upper limits
  const MAX_THC = 30;

  const handleThcChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      thcRange: [values[0], values[1]] as [number, number]
    });
  };

  const handlePriceChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      priceRange: [values[0], values[1]] as [number, number]
    });
  };

  const handleSortChange = (value: 'price-asc' | 'price-desc' | 'thc-desc' | 'popularity') => {
    onFilterChange({
      ...filters,
      sortBy: value
    });
  };

  const handleCategoryChange = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  // Get sort by icon
  const getSortIcon = () => {
    switch (filters.sortBy) {
      case 'price-asc':
        return <ArrowDownZA className="h-3.5 w-3.5" />;
      case 'price-desc':
        return <ArrowDownAZ className="h-3.5 w-3.5" />;
      case 'thc-desc':
        return <Flame className="h-3.5 w-3.5" />;
      case 'popularity':
        return <TrendingUp className="h-3.5 w-3.5" />;
      default:
        return <TrendingUp className="h-3.5 w-3.5" />;
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full py-1 px-2 bg-gray-50 rounded-lg mb-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 h-7 text-xs px-2"
            >
              <Filter className="h-3.5 w-3.5 mr-1" />
              Filter
              {isOpen ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />}
            </Button>
          </CollapsibleTrigger>
          
          {/* Category Selector */}
          {categories.length > 0 && (
            <div className="flex-1 min-w-[120px]">
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="h-7 text-xs px-2 bg-white">
                  <SelectValue placeholder="Kategorie" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    <SelectItem value="All" className="text-xs cursor-pointer">Alle Kategorien</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category} className="text-xs cursor-pointer">
                        {category}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 h-7 text-xs px-2"
              >
                {getSortIcon()}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-xs cursor-pointer"
                onClick={() => handleSortChange('popularity')}
              >
                <TrendingUp className="h-3.5 w-3.5 mr-2" />
                Beliebtheit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-xs cursor-pointer"
                onClick={() => handleSortChange('price-asc')}
              >
                <ArrowDownZA className="h-3.5 w-3.5 mr-2" />
                Preis: Aufsteigend
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-xs cursor-pointer"
                onClick={() => handleSortChange('price-desc')}
              >
                <ArrowDownAZ className="h-3.5 w-3.5 mr-2" />
                Preis: Absteigend
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-xs cursor-pointer"
                onClick={() => handleSortChange('thc-desc')}
              >
                <Flame className="h-3.5 w-3.5 mr-2" />
                THC: Höchster zuerst
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Reset Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="h-7 text-xs px-2"
            title="Filter zurücksetzen"
          >
            <FilterX className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <CollapsibleContent className="mt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* THC & Price Filter */}
          <div className="flex-1 min-w-[200px]">
            <div className="grid grid-cols-2 gap-2">
              {/* THC Range */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium">THC {filters.thcRange[0]}-{filters.thcRange[1]}%</span>
                  </div>
                  <span className="text-xs text-gray-500">Max: {MAX_THC}%</span>
                </div>
                <Slider
                  defaultValue={[0, MAX_THC]}
                  value={[filters.thcRange[0], filters.thcRange[1]]}
                  max={MAX_THC}
                  step={1}
                  onValueChange={handleThcChange}
                  className="my-1"
                />
              </div>
              
              {/* Price Range */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium">€{filters.priceRange[0]}-{filters.priceRange[1]}</span>
                  </div>
                  <span className="text-xs text-gray-500">Max: €{maxPrice}</span>
                </div>
                <Slider
                  defaultValue={[0, maxPrice]}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  max={maxPrice}
                  step={1}
                  onValueChange={handlePriceChange}
                  className="my-1"
                />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Filters;
