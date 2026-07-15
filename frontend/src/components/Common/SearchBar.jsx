import React, { useState, useRef } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ placeholder = "Tìm kiếm sản phẩm...", onSearch, className = "", inputClass = "" }) => {
  const [term, setTerm] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = term.trim();
    if (query && onSearch) {
      onSearch(query);
      setTerm("");
    }
  };

  const handleClear = () => {
    setTerm("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`
        flex items-center bg-gray-50 border border-gray-200/80 rounded-full
        overflow-hidden focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 
        focus-within:border-emerald-500 transition-all duration-300
        ${className}
      `}
    >
      <input
        ref={inputRef}
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 px-4 py-1.5 text-xs sm:text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none ${inputClass}`}
      />
      {term && (
        <button type="button" onClick={handleClear} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      )}
      <button type="submit" className="p-2 text-gray-700 hover:text-emerald-500 transition-colors">
        <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </button>
    </form>
  );
};

export default SearchBar;