
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  ChevronDown,
  ChevronsUpDown,
  FilterX,
  DollarSign,
  Leaf,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FilterOptions = {
  thcRange: [number, number];
  priceRange: [number, number];
  sortBy: 'price-asc' | 'price-desc' | 'thc-desc' | 'popularity';
};

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
  maxPrice: number;
}

const Filters: React.FC<FiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onReset,
  maxPrice
}) => {
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

  // Format percentage for display
  const formatThc = (value: number) => `${value}%`;
  
  // Format price for display
  const formatPrice = (value: number) => `€${value}`;

  // Get sort by display text
  const getSortByText = () => {
    switch (filters.sortBy) {
      case 'price-asc':
        return 'Preis: Aufsteigend';
      case 'price-desc':
        return 'Preis: Absteigend';
      case 'thc-desc':
        return 'THC: Höchster zuerst';
      case 'popularity':
        return 'Beliebtheit';
      default:
        return 'Sortieren nach';
    }
  };

  return (
    <div className="py-3 px-2">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* THC Filter */}
        <div className="flex-1 min-w-[250px]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">THC</span>
            </div>
            <span className="text-xs">
              {formatThc(filters.thcRange[0])} - {formatThc(filters.thcRange[1])}
            </span>
          </div>
          <Slider
            defaultValue={[0, 30]}
            value={[filters.thcRange[0], filters.thcRange[1]]}
            max={30}
            step={1}
            onValueChange={handleThcChange}
            className="my-1"
          />
        </div>

        {/* Price Filter */}
        <div className="flex-1 min-w-[250px]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium">Preis</span>
            </div>
            <span className="text-xs">
              {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
            </span>
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

        {/* Sort By Dropdown */}
        <div className="flex-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 h-8 text-xs"
              >
                <TrendingUp className="h-3.5 w-3.5" />
                <span>{getSortByText()}</span>
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs">Sortieren nach</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-xs cursor-pointer"
                onClick={() => handleSortChange('popularity')}
              >
                Beliebtheit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-xs cursor-pointer"
                onClick={() => handleSortChange('price-asc')}
              >
                Preis: Aufsteigend
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-xs cursor-pointer"
                onClick={() => handleSortChange('price-desc')}
              >
                Preis: Absteigend
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-xs cursor-pointer"
                onClick={() => handleSortChange('thc-desc')}
              >
                THC: Höchster zuerst
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Reset Button */}
        <div className="flex-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onReset}
            className="h-8 text-xs"
          >
            <FilterX className="h-3.5 w-3.5 mr-1" />
            Zurücksetzen
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
