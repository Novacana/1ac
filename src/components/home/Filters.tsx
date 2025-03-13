
import React from "react";
import { FilterOptions, FiltersProps, MAX_THC, MAX_PRICE_LIMIT } from "./filters/FilterTypes";
import SearchField from "./filters/SearchField";
import CategorySelector from "./filters/CategorySelector";
import SortSelector from "./filters/SortSelector";
import ResetButton from "./filters/ResetButton";
import RangeSlider from "./filters/RangeSlider";
import ExpandCollapseButton from "./filters/ExpandCollapseButton";

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
  isExpanded = false,
  onSearchFieldClick = () => {},
}) => {
  // Use the smaller of maxPrice from products or MAX_PRICE_LIMIT
  const effectiveMaxPrice = Math.min(maxPrice || MAX_PRICE_LIMIT, MAX_PRICE_LIMIT);

  const updateThcRange = (value: [number, number]) => {
    onFilterChange({
      ...filters,
      thcRange: value,
    });
  };

  const updatePriceRange = (value: [number, number]) => {
    onFilterChange({
      ...filters,
      priceRange: value,
    });
  };

  return (
    <div className="mb-2">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
        {/* Search field with autocomplete */}
        <div className="col-span-1">
          <SearchField 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onSearchFieldClick={onSearchFieldClick}
          />
        </div>

        {isExpanded && (
          <>
            {/* Category selector */}
            <div>
              <CategorySelector 
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                categories={categories}
              />
            </div>

            {/* Sort selector */}
            <div>
              <SortSelector 
                sortBy={filters.sortBy}
                onFilterChange={onFilterChange}
                filters={filters}
              />
            </div>

            {/* Reset Button */}
            <ResetButton onReset={onReset} />
          </>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* THC Range */}
          <RangeSlider
            label="THC Gehalt (%)"
            unit="%"
            currentRange={filters.thcRange}
            maxValue={MAX_THC}
            onValueChange={updateThcRange}
          />

          {/* Price Range */}
          <RangeSlider
            label="Preis (€)"
            unit="€"
            currentRange={filters.priceRange}
            maxValue={effectiveMaxPrice}
            onValueChange={updatePriceRange}
          />
        </div>
      )}
      
      {/* Expand/Collapse indicator */}
      {searchQuery && (
        <ExpandCollapseButton 
          isExpanded={isExpanded}
          onClick={onSearchFieldClick}
        />
      )}
    </div>
  );
};

export default Filters;
export type { FilterOptions, FiltersProps };
