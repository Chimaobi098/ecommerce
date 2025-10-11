import { Dispatch, SetStateAction, useState } from "react";
import { ArrowBack, Search, YouTube } from "@mui/icons-material";
import { useRouter } from "next/router";
import useCategories from "../../../../utils/seidouVideoUtils/UseCategories";
import { IconButton } from "@mui/material";
import SearchPopup from "./SearchPopUp";

type Props = {
  selectedCategory?: string;
  setSelectedCategory?: Dispatch<SetStateAction<string>>;
  fullHeader?: boolean;
  backButton?: boolean;
};
const Header = ({
  selectedCategory,
  setSelectedCategory,
  fullHeader = true,
  backButton,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const categories = useCategories();
  const [searchOpen, setSearchOpen] = useState(false);

  function handleSearchSubmit(searchTerm: string) {
    if (searchTerm) {
      router.push(`/app-center/seidou-video/search?query=${searchTerm}`);
      setSearchTerm("");
    }
  }

  const handleSearchOpen = () => {
    setSearchOpen(true);
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
  };

  return (
    <div>
      <div
        className={`fixed text-white top-0 left-0 z-10 bg-[#000000c5] backdrop-blur-md w-full max-w-[450px] duration-[0.35s] ${
          !fullHeader ? "-translate-y-[60px]" : ""
        }`}
      >
        <div className="h-[60px] flex gap-x-4 items-center justify-between px-5 pt-[15px] pb-[5px]">
          {backButton ? (
            <IconButton>
              <ArrowBack
                className="text-2xl text-white"
                onClick={() => router.back()}/>
            </IconButton>
          ) : (
            <h1
              className="shrink-0"
              onClick={() => {
                router.push("/app-center/seidou-video");
              }}
            >
              Seidou Video
            </h1>
          )}

          <IconButton onClick={handleSearchOpen}>
            <Search className="text-2xl text-white" />
          </IconButton>
        </div>
        {/* Categories */}
        {setSelectedCategory && (
          <div className={`w-full flex items-center px-2`}>
            <div className="no-scrollbar fade-right py-2.5 w-full h-full flex grow gap-x-3 overflow-x-scroll snap-x snap-mandatory">
              {categories.map((category) => {
                return (
                  <button
                    className={`category-btn flex items-center shrink-0 px-4 py-1 rounded-lg gap-x-2 w-fit ${
                      category.name === selectedCategory
                        ? "bg-red-600"
                        : "border border-[#404040]"
                    }`}
                    onClick={() => {
                      setSelectedCategory
                        ? setSelectedCategory(category.name)
                        : null;
                    }}
                    key={category.name}
                  >
                    <span className={`text-white`}>{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <SearchPopup
        isOpen={searchOpen}
        onClose={handleSearchClose}
        onSearch={handleSearchSubmit}
      />
    </div>
  );
};

export default Header;
