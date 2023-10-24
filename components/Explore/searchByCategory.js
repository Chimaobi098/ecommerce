import React, { useState, useEffect } from "react";
import {
  CategoryItem,
  CategoryWrapper
} from "./searchByCategory.styles";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { AnimatePresence, motion } from "framer-motion";
import { sanityClient, urlFor  } from "../../lib/sanity";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CheckIcon from '@mui/icons-material/Check';
import {useSanityUIDContext} from '../../context/sanityUserId'
import Image from "next/image";


const SearchByCategory = ({ categoryData, productProps, userLikedProducts}) => {
  const sanityUID = useSanityUIDContext();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentLevel, setCurrentLevel] = useState([]);
  const [categorySearchResults, setCategorySearchResults] = useState();
  const [categoryProducts, setCategoryproducts] = useState();
  const [likes, setLikes] = useState({ likeCount: 5, likeState: false });
  const [isVisible, setIsVisible] = useState(false);
  const [support, setSupport] = useState(false);
  const [sort, setSort] = useState('recommend');

  const handleLikes = function(id) {
    (function(productId) {
      if (!user) {
        router.replace("/api/auth/login");
        return;
      }
      fetch("/api/handleLikes", {
        method: "POST",
        body: JSON.stringify({
          _id: productId,
          likeState: !likes.likeState,
          userId: sanityUID,
          likedProducts: {
            _type: "reference",
            _ref: productProps._id,
          },
          productItemKey: userLikedProducts?.filter(
            function(product) {
              return product._ref == productProps._id;
            }
          )[0]?._key,
        }),
      });
    }, 2000);
  };
  console.log(handleLikes);

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
            price,
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
        <div className="flex flex-row my-4 mx-4">
        <button
          onClick={handleBackClick}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <ArrowBackRoundedIcon />
        </button>
        {<div className="font-bolder m-auto font-medium text-xl">{selectedCategory}</div>}
        
        </div>
      )}
      <CategoryWrapper >
        {currentLevel.length < 1 ? (
      <div className="explore-card grid grid-cols-2 gap-4 my-8 mx-4" >
        {currentData
          ? Object.keys(currentData).map((category, i) => (
            
            <div className="card rounded-lg shadow-lg h-auto cursor-pointer" onClick={() => handleCategorySelection(category)} key={i}>
              
              {categorySearchResults?.map((little) =>(
              <div className="" key={little._id}>
                {little?.isRootCategory === true && category == little.title && <img  src={urlFor(little.images[0]).url()} className="rounded-t-lg "/>}
                
                
                </div>
                ))}
              <div className="my-3 text-center ml-4">{category}</div>
              
              
              


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
                      {currentLevel.length > 2 && <div className="flex flex-row border-t border-b py-4 justify-center ml-4">
              <div className="w-6/12 flex justify-center items-center cursor-pointer"
              onClick={toggleVisibility}>Sort <ExpandMoreOutlinedIcon/> </div>
              <div className="w-6/12 text-center cursor-pointer"
              onClick={handlefilter}>Filter</div>


                        </div>}

            <div className="relative">
      <div className={`flex flex-col p-4 gap-y-2 bg-white text-sm absolute w-full transition-all duration-500 ease-in-out transform-gpu cursor-pointer text-gray-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
          <div className="w-full flex flex-row justify-between items-center border-b"
          onClick={()=>{setSort('recommend')}}>
            <h1>Recommended</h1>
            {sort ==='recommend' && <h1 className="scale-75"><CheckIcon /></h1>}
            </div>
            <div className="w-full flex flex-row justify-between items-center border-b"
            onClick={()=>{setSort('new')}}>
            <h1>What's New</h1>
            {sort ==='new' &&<h1 className="scale-75"><CheckIcon /></h1>}
            </div>
            {/* <div className="w-full flex flex-row justify-between items-center border-b"
            onClick={()=>{setSort('best')}}>
            <h1>Best Selling</h1>
            {sort ==='best' && <h1 className="scale-75"><CheckIcon /></h1>}
            </div> */}
            <div className="w-full flex flex-row justify-between items-center border-b"
            onClick={()=>{setSort('high')}}>
            <h1>Price: High to Low</h1>
            {sort ==='high' && <h1 className="scale-75"><CheckIcon /></h1>}
            </div>
            <div className="w-full flex flex-row justify-between items-center border-b"
            onClick={()=>{setSort('low');
            }}>
            <h1>Price: Low to High</h1>
            {sort ==='low' && <h1 className="scale-75"><CheckIcon /></h1>}
            </div>
        </div>
      
    </div>
    <div>
    <div className={` ${support ? 'h-full' : 'h-0'} w-screen z-[300] md:w-[450px] fixed bottom-0 bg-white transition-all duration-500 ease-in-out transform-gpu text-center`} >
      <div className="m-4 flex flex-col gap-y-16 overflow-y-scroll pb-16">

        <div className="flex flex-row justify-between items-center">
          <div className="text-gray-600 scale-125" onClick={handlefilter}> <ExpandMoreOutlinedIcon/></div>
          <div className="font-bold">Filter</div>
          <div className="text-sm text-gray-600">clear</div>

        </div>
        <div className="text-sm font-thin">
          <div className="mb-8 text-left">Select Color</div>
        <div className="color grid grid-cols-3 gap-y-8 gap-x-4">
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>

        </div>
        </div>
        <div className="text-sm font-thin">
          <div className="mb-8 text-left">Select Ocassion</div>
        <div className="color grid grid-cols-2 gap-y-8 gap-x-4">
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>

        </div>
        </div>
        <div className="text-sm font-thin">
          <div className="mb-8 text-left">Select Size</div>
        <div className="color grid grid-cols-3 gap-y-8 gap-x-4">
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>
          <div className="bg-gray-300 py-2">Black</div>

        </div>
        </div>


      </div>
      {/* <div className="fixed bottom-0 w-full md:w-[450px] bg-white py-2 px-4 text-center pb-8">
        <button className="bg-black text-white w-full h-12 rounded-md">Apply Filters</button>
      </div> */}
  
        </div>
    </div>

            <div className=" grid grid-cols-2 gap-4 my-8 ml-4">
          {sort ==='low' && (categoryItem.Orderasc?.map((product) => (
            

    <div key={product._id} className="explore-card " >
    
    <div className="card rounded-lg shadow-lg h-auto cursor-pointer">
      <div className="">
         <Image src={urlFor(product.defaultProductVariant.images[0]).url()} className="rounded-t-lg w-full h-48 min-h-48 max-h-48"/>
           
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
                handleLikes(product._id);
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
            

            <div key={product._id} className="explore-card " >
            
            <div className="card rounded-lg shadow-lg h-auto cursor-pointer">
              <div className="">
                 <Image src={urlFor(product.defaultProductVariant.images[0]).url()} className="rounded-t-lg w-full h-48 min-h-48 max-h-48"/>
                   
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
                        handleLikes(product._id);
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
        {sort ==='high' && (categoryItem.orderdesc?.map((product) => (
            

            <div key={product._id} className="explore-card " >
            
            <div className="card rounded-lg shadow-lg h-auto cursor-pointer">
              <div className="">
                 <Image src={urlFor(product.defaultProductVariant.images[0]).url()} className="rounded-t-lg w-full h-48 min-h-48 max-h-48"/>
                   
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
                        handleLikes(product._id);
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
            

            <div key={product._id} className="explore-card " >
            
            <div className="card rounded-lg shadow-lg h-auto cursor-pointer">
              <div className="">
                 <Image src={urlFor(product.defaultProductVariant.images[0]).url()} className="rounded-t-lg w-full  min-h-48 max-h-48 h-48"/>
                   
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
                        handleLikes(product._id);
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
