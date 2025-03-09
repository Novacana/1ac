
import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchAutocomplete from "../SearchAutocomplete";

interface MobileSearchProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  suggestions: string[];
  handleSearch: (query: string) => void;
}

const MobileSearch: React.FC<MobileSearchProps> = ({
  showSearch,
  setShowSearch,
  suggestions,
  handleSearch
}) => {
  if (!showSearch) {
    return (
      <button
        onClick={() => setShowSearch(true)}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
          "bg-background/70 text-foreground shadow-sm"
        )}
        aria-label="Produkte suchen"
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <SearchAutocomplete
          suggestions={suggestions}
          onSearch={handleSearch}
          placeholder="Suche nach Sorte..."
          fullWidth
          autoFocus
          maxSuggestions={8}
          compact={true}
        />
        <button 
          type="button" 
          onClick={() => setShowSearch(false)}
          className="absolute right-4 top-4 p-2 rounded-full bg-background/70 text-foreground shadow-sm"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default MobileSearch;
