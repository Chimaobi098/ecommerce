import React from "react";
import {
  CategoryItem,
  CategoryWrapper,
  Wrapper,
} from "./searchByCategory.styles";
import Image from "next/image";
// import { useNextSanityImage } from 'next-sanity-image';
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { AnimatePresence, motion } from "framer-motion";
import { sanityClient } from "../../lib/sanity";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CheckIcon from '@mui/icons-material/Check';
import { urlFor } from "../../lib/sanity";
import {useSanityUIDContext} from '../../context/sanityUserId'

const SearchByCategory = ({ categoryData}) => {

  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentLevel, setCurrentLevel] = useState([]);
  const [categorySearchResults, setCategorySearchResults] = useState();
  const [categoryProducts, setCategoryproducts] = useState();
  const [likes, setLikes] = useState({ likeCount: 5, likeState: false });
  const [isVisible, setIsVisible] = useState(false);
  const [support, setSupport] = useState(false);
  const [sort, setSort] = useState('recommend')


  const handlefilter = () =>{
    setSupport(!support)
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
    console.log(categoryProducts);

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
  //bring in products of various categories

  useEffect(()=>{
    async function getProducts(){

    const productresult = await sanityClient.fetch(
      `
      *[_type == 'category' ]{

        title,
        'categoryProducts':*[_type == 'product' && references(^._id) && !(_id in path('drafts.**'))]{
          slug,
          defaultProductVariant,
          title,
          _id
        },
        'newlyupdated':*[_type == 'product' && references(^._id) && !(_id in path('drafts.**'))]{
          slug,
          defaultProductVariant,
          title,
          _id,
          _createdAt
        } | order(_createdAt desc),
        'Orderasc': *[_type == 'product' && references(^._id) && !(_id in path('drafts.**'))]{
          slug,
          defaultProductVariant{
            images,
            price
          },
          title,
          _id
        } | order(defaultProductVariant.price asc),
        'orderdesc': *[_type == 'product' && references(^._id) && !(_id in path('drafts.**'))]{
          slug,
          defaultProductVariant{
            images,
            price
          },
          title,
          _id
        } | order(defaultProductVariant.price desc)
      }`);
      setCategoryproducts(productresult);


    }
    getProducts()

  },[]);






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
      <CategoryWrapper >
        {currentLevel.length < 1 ? (
      <div className="explore-card grid grid-cols-2 gap-4 my-8" >
        {currentData
          ? Object.keys(currentData).map((category, i) => (
            
            <div className="card rounded-lg shadow-lg h-auto cursor-pointer" onClick={() => handleCategorySelection(category)} key={i}>
              
              {categorySearchResults?.map((little, i) =>(
              <div className="" key={i}>
                {little?.isRootCategory === true && category == little.title && <img  src={urlFor(little.images[0]).url()} className="rounded-t-lg "/>}
                
                
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
                key={i}
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

          {/* Inserting products into the categories */}

          {categoryProducts?.map((categoryItem) => (
            <>
            {selectedCategory == categoryItem.title && 
            
        <div className="relative">
                      {<div className="flex flex-row border-t border-b py-4 justify-center">
              <div className="w-6/12 flex justify-center items-center cursor-pointer"
              onClick={toggleVisibility}>Sort <ExpandMoreOutlinedIcon/> </div>
              <div className="w-6/12 text-center cursor-pointer"
              onClick={handlefilter}>Filter</div>


            </div>}

            <div className="relative">
      <div className={`flex flex-col p-4 gap-y-2 bg-white text-sm absolute w-full transition-all duration-500 ease-in-out transform-gpu cursor-pointer text-gray-800 ${isVisible ? 'opacity-100 translate-y-0 z-30' : 'opacity-0 -translate-y-2 z-10'}`}>
          <p className="w-full flex flex-row justify-between items-center border-b"
          onClick={()=>{setSort('recommend')}}>
            <h1>Recommended</h1>
            {sort ==='recommend' && <h1 className="scale-75"><CheckIcon /></h1>}
            </p>
            <p className="w-full flex flex-row justify-between items-center border-b"
            onClick={()=>{setSort('new')}}>
            <h1>What's New</h1>
            {sort ==='new' &&<h1 className="scale-75"><CheckIcon /></h1>}
            </p>
            <p className="w-full flex flex-row justify-between items-center border-b"
            onClick={()=>{setSort('best')}}>
            <h1>Best Selling</h1>
            {sort ==='best' && <h1 className="scale-75"><CheckIcon /></h1>}
            </p>
            <p className="w-full flex flex-row justify-between items-center border-b"
            onClick={()=>{setSort('high')}}>
            <h1>Price: High to Low</h1>
            {sort ==='high' && <h1 className="scale-75"><CheckIcon /></h1>}
            </p>
            <p className="w-full flex flex-row justify-between items-center border-b"
            onClick={()=>{setSort('low');
            }}>
            <h1>Price: Low to High</h1>
            {sort ==='low' && <h1 className="scale-75"><CheckIcon /></h1>}
            </p>
        </div>
      
    </div>
    <div>
    <div className={` ${support ? 'h-[720px]' : 'h-0'} w-[430px] md:w-[450px] -left-2 md:-left-6  overscroll-x-none  absolute bottom-0 bg-white transition-all duration-500 ease-in-out transform-gpu`} >
      <div className="mt-20" onClick={handlefilter}>cancel</div>

  
        </div>
    </div>

            <div className=" grid grid-cols-2 gap-4 my-8">
          {sort ==='low' && (categoryItem.Orderasc?.map((product) => (
            

    <div className="explore-card " >
    
    <div className="card rounded-lg shadow-lg h-auto cursor-pointer">
      <div className="">
         <img src={urlFor(product.defaultProductVariant.images[0]).url()} className="rounded-t-lg w-full h-48"/>
           
      </div>
        <div className="mx-2">
        <div className="flex flex-row justify-between items-center text-lg">
      <div className="my-3 text-center">₦{product.defaultProductVariant.price}</div>
      <div>
      <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                setLikes((prev) => {
                  if (prev.likeState) {
                    return { likeCount: prev.likeCount - 1, likeState: false };
                  }
                  return { likeCount: prev.likeCount + 1, likeState: true };
                });
                // handleLikes(productProps._id);
              }}
            >
              {likes.likeState ? (
                <FavoriteIcon
                  fontSize="medium"
                  color="error"
                />
              ) : (
                <FavoriteBorderIcon
                  fontSize="medium"
                />
              )}
            </motion.button>
      </div>
      </div>
      <div className="pb-2 text-sm text-gray-600" key={product.id}>{product.title}
      
      </div>

      </div>

    </div>
  </div>
        

        
          )))} 
          {sort ==='recommend' && (categoryItem.categoryProducts?.map((product) => (
            

            <div className="explore-card " >
            
            <div className="card rounded-lg shadow-lg h-auto cursor-pointer">
              <div className="">
                 <img src={urlFor(product.defaultProductVariant.images[0]).url()} className="rounded-t-lg w-full h-48"/>
                   
              </div>
                <div className="mx-2">
                <div className="flex flex-row justify-between items-center text-lg">
              <div className="my-3 text-center">₦{product.defaultProductVariant.price}</div>
              <div>
              <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => {
                        setLikes((prev) => {
                          if (prev.likeState) {
                            return { likeCount: prev.likeCount - 1, likeState: false };
                          }
                          return { likeCount: prev.likeCount + 1, likeState: true };
                        });
                        // handleLikes(productProps._id);
                      }}
                    >
                      {likes.likeState ? (
                        <FavoriteIcon
                          fontSize="medium"
                          color="error"
                        />
                      ) : (
                        <FavoriteBorderIcon
                          fontSize="medium"
                        />
                      )}
                    </motion.button>
              </div>
              </div>
              <div className="pb-2 text-sm text-gray-600" key={product.id}>{product.title}
              
              </div>
        
              </div>
        
            </div>
          </div>
                
        
                
                  )))}
        {sort ==='high' && (categoryItem.categoryProducts?.map((product) => (
            

            <div className="explore-card " >
            
            <div className="card rounded-lg shadow-lg h-auto cursor-pointer">
              <div className="">
                 <img src={urlFor(product.defaultProductVariant.images[0]).url()} className="rounded-t-lg w-full h-48"/>
                   
              </div>
                <div className="mx-2">
                <div className="flex flex-row justify-between items-center text-lg">
              <div className="my-3 text-center">₦{product.defaultProductVariant.price}</div>
              <div>
              <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => {
                        setLikes((prev) => {
                          if (prev.likeState) {
                            return { likeCount: prev.likeCount - 1, likeState: false };
                          }
                          return { likeCount: prev.likeCount + 1, likeState: true };
                        });
                        // handleLikes(productProps._id);
                      }}
                    >
                      {likes.likeState ? (
                        <FavoriteIcon
                          fontSize="medium"
                          color="error"
                        />
                      ) : (
                        <FavoriteBorderIcon
                          fontSize="medium"
                        />
                      )}
                    </motion.button>
              </div>
              </div>
              <div className="pb-2 text-sm text-gray-600" key={product.id}>{product.title}
              
              </div>
        
              </div>
        
            </div>
          </div>
                
        
                
                  )))}
          {sort ==='new' && (categoryItem.newlyupdated?.map((product) => (
            

            <div className="explore-card " >
            
            <div className="card rounded-lg shadow-lg h-auto cursor-pointer">
              <div className="">
                 <img src={urlFor(product.defaultProductVariant.images[0]).url()} className="rounded-t-lg w-full h-48"/>
                   
              </div>
                <div className="mx-2">
                <div className="flex flex-row justify-between items-center text-lg">
              <div className="my-3 text-center">₦{product.defaultProductVariant.price}</div>
              <div>
              <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => {
                        setLikes((prev) => {
                          if (prev.likeState) {
                            return { likeCount: prev.likeCount - 1, likeState: false };
                          }
                          return { likeCount: prev.likeCount + 1, likeState: true };
                        });
                        // handleLikes(productProps._id);
                      }}
                    >
                      {likes.likeState ? (
                        <FavoriteIcon
                          fontSize="medium"
                          color="error"
                        />
                      ) : (
                        <FavoriteBorderIcon
                          fontSize="medium"
                        />
                      )}
                    </motion.button>
              </div>
              </div>
              <div className="pb-2 text-sm text-gray-600" key={product.id}>{product.title}
              
              </div>
        
              </div>
        
            </div>
          </div>
                
        
                
                  )))}

</div>
        </div>


        }
        </>
        ))}
            </>
          )
          }       
          </CategoryWrapper>
    </AnimatePresence>
  );
};

export default SearchByCategory;
