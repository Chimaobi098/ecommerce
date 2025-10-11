import React, { useRef } from "react";
import { Button, Input } from "@mui/material";
import { ArrowBack, Search } from "@mui/icons-material";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
};

const SearchPopup = ({ isOpen, onClose, onSearch }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (inputRef.current?.value) {
      onSearch(inputRef.current.value);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      <div className="flex items-center gap-3 px-4 py-3 ">
        {/* Back Button */}
        <button
          className="text-white hover:text-gray-300 transition-colors"
          onClick={onClose}
        >
          <ArrowBack fontSize="large" />
        </button>

        {/* Search Input */}
        <div className="flex-1 bg-[#2a2a2a] rounded-lg px-4 py-2 flex items-center gap-2">
          <Input
            inputRef={inputRef}
            type="text"
            placeholder="Search"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onSearch((e.target as HTMLInputElement).value);
                onClose();
              }
            }}
            autoFocus
            disableUnderline
            fullWidth
            sx={{
              color: "white",
              fontSize: "1rem",
              "& .MuiInput-input": {
                color: "white",
                padding: 0,
              },
              "& .MuiInput-input::placeholder": {
                color: "#888",
                opacity: 1,
              },
            }}
          />
        </div>

        {/* Search Icon Button */}
        <Button
          onClick={handleSearch}
          className="text-white hover:text-gray-300 transition-colors"
        >
          <Search fontSize="large" />
        </Button>
      </div>

      {/* Search Results Area */}
      <div className="p-4">{/* Add your search results here */}</div>
    </div>
  );
};

export default SearchPopup;
