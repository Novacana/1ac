
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterOptions } from "./FilterTypes";

interface SortSelectorProps {
  sortBy: string;
  onFilterChange: (filters: FilterOptions) => void;
  filters: FilterOptions;
}

const SortSelector: React.FC<SortSelectorProps> = ({
  sortBy,
  onFilterChange,
  filters,
}) => {
  return (
    <Select
      value={sortBy}
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
  );
};

export default SortSelector;
