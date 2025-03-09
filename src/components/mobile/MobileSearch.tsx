
import React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchAutocomplete from "../SearchAutocomplete";

interface MobileSearchProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  suggestions: string[];
  handleSearch: (query: string) => void;
  onSearchFieldClick?: () => void;
}

const MobileSearch: React.FC<MobileSearchProps> = ({
  showSearch,
  setShowSearch,
  suggestions,
  handleSearch,
  onSearchFieldClick
}) => {
  if (!showSearch) {
    return (
      <button
        onClick={() => setShowSearch(true)}
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all",
          "bg-background/40 text-foreground"
        )}
        aria-label="Produkte suchen"
      >
        <Search size={18} />
      </button>
    );
  }

  const handleWrapperClick = () => {
    if (onSearchFieldClick) {
      onSearchFieldClick();
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md" onClick={handleWrapperClick}>
        <SearchAutocomplete
          suggestions={suggestions}
          onSearch={handleSearch}
          placeholder="Suche..."
          fullWidth
          autoFocus
          maxSuggestions={8}
          compact={true}
        />
        <button 
          type="button" 
          onClick={() => setShowSearch(false)}
          className="absolute right-4 top-4 p-2 rounded-full bg-background/40 text-foreground"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default MobileSearch;
