import { ArrowDownward } from "@mui/icons-material";
import { useState, useRef, useEffect } from "react";

interface CategoryDropdownProps {
  categories: string[];
  currentFilter: string;
  setFilter: (filter: string) => void;
}

const CategoryDropdown = ({
  categories,
  currentFilter,
  setFilter,
}: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="relative w-64 mx-auto mt-[9vh]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>
          {currentFilter === "Unknown" ? "Uncategorized" : currentFilter}
        </span>
        <ArrowDownward
          className={`w-5 h-5 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                currentFilter === cat ? "bg-blue-100 font-medium" : ""
              }`}
            >
              {cat === "Unknown" ? "Uncategorized" : cat}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
