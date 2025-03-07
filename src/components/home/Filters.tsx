
import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  FilterX,
  DollarSign,
  Leaf,
  ArrowDownAZ,
  ArrowDownZA,
  ArrowDown,
  Flame,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
    <div className="py-2 px-2 bg-gray-50 rounded-lg mb-3">
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
            
            {/* Price Range */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium">€{filters.priceRange[0]}-{filters.priceRange[1]}</span>
                </div>
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

        {/* Sort By Dropdown */}
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
    </div>
  );
};

export default Filters;
