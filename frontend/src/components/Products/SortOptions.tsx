import React, { ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";

export interface SortOptionsProps {
  onSortChange?: (sort?: string) => void;
}

const SortOptions: React.FC<SortOptionsProps> = ({ onSortChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    const sortBy = e.target.value;
    if (sortBy) {
      searchParams.set("sortBy", sortBy);
    } else {
      searchParams.delete("sortBy");
    }
    setSearchParams(searchParams);
    if (onSortChange) {
      onSortChange(sortBy);
    }
  };

  return (
    <div className="mb-4 flex items-center justify-end">
      <select
        id="sort"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
        className="border p-2 rounded-md focus:outline-none text-sm text-gray-700 bg-white"
      >
        <option value="">Default</option>
        <option value="priceASC">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortOptions;
