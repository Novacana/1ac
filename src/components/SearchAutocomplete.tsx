
import React, { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface SearchAutocompleteProps {
  suggestions: string[];
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  fullWidth?: boolean;
  autoFocus?: boolean;
  onClose?: () => void;
  maxSuggestions?: number;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  suggestions,
  onSearch,
  placeholder = "Suche nach Sorte...",
  className = "",
  fullWidth = false,
  autoFocus = false,
  onClose,
  maxSuggestions = 5,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close suggestions
  useOnClickOutside(wrapperRef, () => {
    setShowSuggestions(false);
  });

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = suggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, maxSuggestions);
    
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  }, [searchQuery, suggestions, maxSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setShowSuggestions(false);
      
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      
      // Optional: clear search after submission if needed
      // setSearchQuery("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    navigate(`/products?search=${encodeURIComponent(suggestion)}`);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      ref={wrapperRef} 
      className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <form onSubmit={handleSearch} className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className={`${fullWidth ? 'w-full' : ''} pr-16 pl-10`}
          value={searchQuery}
          onChange={handleInputChange}
          autoFocus={autoFocus}
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" 
        />
        {searchQuery && (
          <button 
            type="button" 
            onClick={handleClearSearch}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={16} />
          </button>
        )}
        <button 
          type="submit" 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Suchen"
        >
          <Search size={16} />
        </button>
      </form>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-popover shadow-md rounded-md border border-border overflow-hidden">
          <ul className="py-1 max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <li 
                key={index}
                className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
