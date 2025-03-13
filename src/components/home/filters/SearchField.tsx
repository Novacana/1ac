
import React from "react";
import SearchAutocomplete from "@/components/SearchAutocomplete";
import { useProductSuggestions } from "@/hooks/useProductSuggestions";

interface SearchFieldProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchFieldClick: () => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
  searchQuery,
  onSearchChange,
  onSearchFieldClick,
}) => {
  const { suggestions } = useProductSuggestions();

  const handleSearch = (query: string) => {
    onSearchChange(query);
  };

  return (
    <div 
      onClick={onSearchFieldClick} 
      className="w-full cursor-text"
    >
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
  );
};

export default SearchField;
