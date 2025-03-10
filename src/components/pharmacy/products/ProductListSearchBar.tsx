
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ProductListSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isAnyProductSelected: boolean;
  onDeleteSelected: () => void;
}

const ProductListSearchBar: React.FC<ProductListSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  isAnyProductSelected,
  onDeleteSelected
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Produkte durchsuchen..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => toast.info("Filter-Optionen werden geöffnet")}
        >
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => toast.info("Bestand aktualisieren")}
        >
          <ShoppingCart className="h-4 w-4" />
          Bestand
        </Button>
        {isAnyProductSelected && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteSelected}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Ausgewählte löschen
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductListSearchBar;
