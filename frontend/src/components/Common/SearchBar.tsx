import React, { useState, useRef, FormEvent, ChangeEvent } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (term: string) => void;
  className?: string;
  inputClass?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Tìm kiếm sản phẩm...",
  onSearch,
  className = "",
  inputClass = "",
}) => {
  const [term, setTerm] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const query = term.trim();
    if (query && onSearch) {
      onSearch(query);
      setTerm("");
    }
  };

  const handleClear = (): void => {
    setTerm("");
    inputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTerm(e.target.value);
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
        onChange={handleChange}
        placeholder={placeholder}
        className={`flex-1 px-4 py-1.5 text-xs sm:text-sm text-gray-700 placeholder-gray-400 bg-transparent focus:outline-none ${inputClass}`}
      />
      {term && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Xóa từ khóa"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <button
        type="submit"
        className="p-2 text-gray-700 hover:text-emerald-500 transition-colors"
        aria-label="Tìm kiếm"
      >
        <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </button>
    </form>
  );
};

export default SearchBar;
