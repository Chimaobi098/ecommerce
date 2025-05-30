import React, { useRef } from "react";
import { useState } from "react";
import { sanityClient, urlFor } from "../../lib/sanity";
import { Wrapper, NavBar } from "./home.styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import { useEffect } from "react";
import Badge from "@mui/material/Badge";
import { useShoppingCart } from "../../context/shoppingCart";
//import LocalMallIcon from "@mui/icons-material/LocalMall";
import { HomeProduct } from "../../pages";
import ProductContainer from "./productItem/productContainer";
import { ShoppingBagIcon } from "../../public/ShoppingBag";
import AuctionIcon from "../../public/Auction";
import { useRouter } from "next/router";
import { ChevronRight } from "@mui/icons-material";

const Home = ({ results }: HomeProduct) => {
  const { getCartQuantity, cartOpen, setCartOpen } = useShoppingCart();
  const { user, error } = useUser();
  const router = useRouter()
  const [productData, setProductData] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  const [userLikedProducts, setUserLikedProducts] = useState();
  const [userSavedProducts, setUserSavedProducts] = useState();
  const lastId = useRef<string | null>(results[results.length - 1]._id);
  const initialLoad = useRef(true)
  const lastScrollValue = useRef<number>(0)
  const [loading, setLoading] = useState(false);
  const searchFilters = {
    All: [],
    Tops: ['blouse','tee','shirt'],
    Bags: ['bag'],
    Skirts: ['skirt'],
    Shoes: ['shoes'],
    Jeans: ['jeans'],
    Shades: ['sunglasses'],
    Headwear: ['hat','cap'],
    Foods: ['burger','meal','rice','chicken','ice cream'],
  }
  const [activeFilter, setActiveFilter] = useState<keyof typeof searchFilters>('All')
  const [fullHeader, setFullHeader] = useState(true)

  useEffect(() => {
    async function likedProducts() {
      if (!user) return;
      let response = await sanityClient.fetch(
        `*[_type == "users" && userId == $curr] {
     likedProducts

    }`,
        { curr: user?.sub }
      );
      let likedProductsArray = response[0]?.likedProducts;
      setUserLikedProducts(likedProductsArray || []);
    }
    likedProducts();
    async function savedProducts() {
      if (!user) return;
      let response = await sanityClient.fetch(
        `*[_type == "users" && userId == $curr] {
     savedProducts

    }`,
        { curr: user?.sub }
      );
      let savedProductsArray = response[0]?.savedProducts;
      setUserSavedProducts(savedProductsArray || []);
    }
    savedProducts();
  }, [user]);

  async function fetchNextPage() {
    const { current } = lastId;
    if (current === null) {
      setHasMore(false);
    }
    const tagFilter = searchFilters[activeFilter].length
      ? `count(tags[@ in $selectedTags]) > 0 &&`
      : '';
    const data = await sanityClient.fetch(
      `*[_type == "product" && _id > $current && 
      ${tagFilter}
      true
      ] | order(_id) [0...3] {
     defaultProductVariant,
  _id,
  title,
  slug,
  category,
  vendor->{
    title,
    logo,
    _id
},
    }`,
      { 
        current: current,
        selectedTags: searchFilters[activeFilter],
        tagFilter: tagFilter
      }
    );
    if (data.length > 0) {
      lastId.current = data[data.length - 1]._id;
      setProductData((prev) => [...prev, ...data]);
    } else {
      lastId.current = null; // Reached the end
      setHasMore(false);
    }
  }

    useEffect(()=>{
      async function filteredNewFetch() {
        const tagFilter = searchFilters[activeFilter].length
        ? `count(tags[@ in $selectedTags]) > 0 &&`
        : '';
        setHasMore(true)
        const data = await sanityClient.fetch(
            `*[_type == "product" &&
            ${tagFilter}
            true
            ] | order(_id) [0...3] {
          defaultProductVariant,
          _id,
          title,
          slug,
          category,
          vendor->{
            title,
            logo,
            _id
          },
          }`,
          { 
            selectedTags: searchFilters[activeFilter],
            tagFilter: tagFilter
          }
        );
        if (data.length > 0) {
          lastId.current = data[data.length - 1]._id;
          setProductData(data);
        }else{
          setProductData([])
          setHasMore(false)
        }
      }

      if(!initialLoad.current){
        filteredNewFetch()
      } else {
        initialLoad.current = false
      }
      
      
    }, [activeFilter])

  function handleTagSelection(filter: keyof typeof searchFilters){
    const feed: HTMLElement|null = document.getElementById('parent')
    feed?.scrollTo({top:0})

    const filterButton: HTMLElement|null = document.querySelector(`.${filter}-tag`)
    filterButton?.scrollIntoView({inline: 'start', block: 'nearest', behavior: 'smooth'})
    setActiveFilter(filter)
  }

  function checkScrollDirection(){
    const feed: HTMLElement|null = document.getElementById('parent')
    const newScrollValue = feed?.scrollTop || 0
    if(Math.abs(newScrollValue - lastScrollValue.current) < 20){
      return // Don't even bother if scrolling displacement is less than 20 to minimize unnecessary triggers
    }
    if((newScrollValue >= lastScrollValue.current) && (newScrollValue >= 100)){
      setFullHeader(false)
    } else {
      setFullHeader(true)
    }
    lastScrollValue.current = newScrollValue
  }

  return (
    <>
        {loading && (
          <div className="loading-page h-[100%] top-0 w-[100%] absolute z-[100] bg-white flex justify-center items-center">
            <svg className="animate-spin h-16 w-16 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}

      <NavBar className={`duration-[0.35s] ${!fullHeader? '-translate-y-[60px]':''}`}>
        <div className="h-[60px] flex items-center justify-between px-5 pt-[20px]">
          <h1>Seidou</h1>
          <div className="flex gap-x-5 items-center">
            <button
              onClick={() => { router.push('/auction') }}
              className="w-[30px] text-black">
              <AuctionIcon />
            </button>

            <button
              onClick={() => { setCartOpen(true) }}
              className="w-[30px] text-black">
              <Badge
                badgeContent={getCartQuantity()}
                color="error"
                overlap="rectangular"
              >
                <ShoppingBagIcon />
              </Badge>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className={`w-full flex items-center bg-white px-2`}>
          <div className="no-scrollbar fade-right py-2.5 w-full h-full flex grow gap-x-3 overflow-x-scroll snap-x snap-mandatory">
            {(Object.keys(searchFilters) as Array<keyof typeof searchFilters>).map((filter, index)=>{
              return(
                <button key={index} className={`flex-shrink-0 rounded-md px-3.5 py-1.5 text-sm first:ml-10 last:mr-28 
                snap-start scroll-ml-3 active:scale-[1.07] transition-transform ${filter}-tag ${filter===activeFilter? 'bg-[#202020] text-white':'bg-[#f5f5f5]'}`}
                onClick={()=>{handleTagSelection(filter)}}>
                  {filter}
                </button>
              )
            })}
          </div>
          <div className="h-full flex items-center justify-center px-2 bg-white">
            <ChevronRight className="w-7"/>
          </div>
        </div>
      </NavBar>

      <Wrapper id="parent" onScroll={()=>{checkScrollDirection()}}>
        <InfiniteScroll
          dataLength={productData.length}
          next={fetchNextPage}
          hasMore={hasMore}
          loader={<CircularProgress style={{ marginBottom: "50px" }} />}
          endMessage={
            <p className="text-center">
              <b>Yay! You have seen it all</b>
            </p>
          }
          scrollableTarget="parent"
          className="flex flex-col items-center pt-2"
        >
          {productData.map((product) => {
            if(product.vendor&& product.vendor.logo)return (<ProductContainer
              productProps={product}
              setLoading={setLoading}
              userLikedProducts={userLikedProducts}
              userSavedProducts={userSavedProducts}
              key={product._id}

            />)
          }
            
          )}
        </InfiniteScroll>
      </Wrapper>
    </>
  );
};

export default Home;
