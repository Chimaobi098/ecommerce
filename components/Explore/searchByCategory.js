import React from "react";
import {
  CategoryItem,
  CategoryWrapper,
  Wrapper,
} from "./searchByCategory.styles";
import Image from "next/image";
// import { useNextSanityImage } from 'next-sanity-image';
import { useState, useEffect } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { AnimatePresence, motion } from "framer-motion";
import { sanityClient } from "../../lib/sanity";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { urlFor } from "../../lib/sanity";

const SearchByCategory = ({ categoryData}) => {

  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentLevel, setCurrentLevel] = useState([]);
  const [categorySearchResults, setCategorySearchResults] = useState();
    console.log(selectedCategory);

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
  useEffect(() => {
    async function getCategories() {
      const results = await sanityClient.fetch(`*[_type == 'category' ]{
  _id,
  isRootCategory,
  images,
  description,
  title,

}`);
  setCategorySearchResults(results);
  
    }
    getCategories();
  }, []);

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

    // setCategorySearchResults(results);
  };
  

  let currentData = categoryData;
  for (const category of currentLevel) {
    currentData = currentData[category];
  }

  return (
    <AnimatePresence>
      {currentLevel.length > 0 && (
        <div className="flex flex-row my-4">
        <button
          onClick={handleBackClick}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowBackRoundedIcon />
        </button>
        {<div className="font-bolder m-auto font-medium text-xl">{selectedCategory}</div>}
        
        </div>
      )}
      {/* {categorySearchResults?.map((header)=>{
        <div>
          {header?.title}
        </div>
      })} */}
      <CategoryWrapper>
        {currentLevel.length < 1 ? (
      <div className="explore-card grid grid-cols-2 gap-4 my-8" >
        {currentData
          ? Object.keys(currentData).map((category, i) => (
            
            <div className="card rounded-lg shadow-lg h-auto cursor-pointer" onClick={() => handleCategorySelection(category)} key={category}>
              
              {categorySearchResults?.map((little) =>(
              <div className="">
                {little?.isRootCategory === true && category == little.title && <img src={urlFor(little.images[0]).url()} className="rounded-t-lg "/>}
                
                </div>
                ))}
              <div className="my-3 text-center">{category}</div>
              
              
              


            </div>


          

                /* <span>{category}</span> */
              
            ))
          : null}
          </div>
          ) : (
            <>
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
            </>
          )
          }       
          </CategoryWrapper>

    </AnimatePresence>
  );
};

export default SearchByCategory;
