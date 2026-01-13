"use client";

import { Search, X } from "lucide-react";

import { DEBOUNCE_DELAY, QUERY_KEYS } from "@/constants";
import { useSearch } from "@/hooks/useSearch";
import { SearchInputProps } from "@/types/search";

const SearchInput: React.FC<SearchInputProps> = ({
  queryKey = QUERY_KEYS.SEARCH,
  debounceDelay = DEBOUNCE_DELAY,
  ...props
}) => {
  const { value, handleChange, handleClear } = useSearch({
    queryKey,
    debounceDelay,
  });

  return (
    <div className="search-input-wrapper">
      <Search size={16} style={{ marginRight: 8, flexShrink: 0 }} />
      <input
        className="form-control"
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        {...props}
        style={{
          border: "none",
          outline: "none",
          flex: 1,
          fontSize: 14,
          boxShadow: "none",
        }}
      />
      {value && (
        <X
          size={16}
          onClick={handleClear}
          style={{ cursor: "pointer", flexShrink: 0 }}
        />
      )}
    </div>
  );
};

export default SearchInput;
