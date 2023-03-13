import React from "react";
import {
  CategoryItem,
  CategoryWrapper,
  Wrapper,
} from "./searchByCategory.styles";
import { useState } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { AnimatePresence, motion } from "framer-motion";
import { sanityClient } from "../../lib/sanity";

const SearchByCategory = ({ categoryData }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentLevel, setCurrentLevel] = useState([]);
  const [categorySearchResults, setCategorySearchResults] = useState();
  console.log(selectedCategory, categorySearchResults);
  const handleCategorySelection = (category) => {
    if (Object.values(currentData[category]).length == 0) {
      fetchCategoryProducts();
    }
    setSelectedCategory(category);
    setCurrentLevel((prevCurrentLevel) => [...prevCurrentLevel, category]);
  };

  const handleBackClick = () => {
    setCurrentLevel((prevCurrentLevel) => {
      const updatedCurrentLevel = prevCurrentLevel.slice(
        0,
        prevCurrentLevel.length - 1
      );
      setSelectedCategory(updatedCurrentLevel[updatedCurrentLevel.length - 1]);
      return updatedCurrentLevel;
    });
  };

  const fetchCategoryProducts = async () => {
    const results = await sanityClient.fetch(
      `*[_type == 'product' && $keyword in tags[]] {
  defaultProductVariant,
  _id,
  title,
  slug,
  
}`,
      { keyword: selectedCategory }
    );

    setCategorySearchResults(results);
  };

  let currentData = categoryData;
  for (const category of currentLevel) {
    currentData = currentData[category];
  }

  return (
    <AnimatePresence>
      {currentLevel.length > 0 && (
        <button onClick={handleBackClick}>Back</button>
      )}
      <CategoryWrapper>
        {currentData
          ? Object.keys(currentData).map((category, i) => (
              <CategoryItem
                key={category}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                onClick={() => handleCategorySelection(category)}
              >
                <span>{category}</span>
                <ArrowForwardIosRoundedIcon />
              </CategoryItem>
            ))
          : null}
      </CategoryWrapper>
    </AnimatePresence>
  );
};

export default SearchByCategory;
