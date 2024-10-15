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

const Home = ({ results }: HomeProduct) => {
  const { getCartQuantity, cartOpen, setCartOpen } = useShoppingCart();
  const { user, error } = useUser();
  const router = useRouter()
  const [productData, setProductData] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  const [userLikedProducts, setUserLikedProducts] = useState();
  const [userSavedProducts, setUserSavedProducts] = useState();
  const lastId = useRef<string | null>(results[results.length - 1]._id);
  const [loading, setLoading] = useState(false);

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
    const data = await sanityClient.fetch(
      `*[_type == "product" && _id > $current] | order(_id) [0...3] {
     defaultProductVariant,
  _id,
  
  title,
  slug,
  category,
  vendor->{
  title,
  logo,_id
},
_id
    }`,
      { current }
    );
    if (data.length > 0) {
      lastId.current = data[data.length - 1]._id;
      setProductData((prev) => [...prev, ...data]);
    } else {
      lastId.current = null; // Reached the end
      setHasMore(false);
    }
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

      <NavBar>
        <h1>Seidou</h1>
        <div className="flex gap-x-5 items-center">
          <button
            onClick={() => { router.push('/auction') }}
            className="h-[60px] text-black">
            <AuctionIcon />
          </button>

          <button
            onClick={() => { setCartOpen(true) }}
            className="h-[60px] text-black">
            <Badge
              badgeContent={getCartQuantity()}
              color="error"
              overlap="rectangular"
            >
              <ShoppingBagIcon />
            </Badge>
          </button>
        </div>
      </NavBar>
      <Wrapper id="parent">
        <InfiniteScroll
          dataLength={productData.length}
          next={fetchNextPage}
          hasMore={hasMore}
          loader={<CircularProgress style={{ marginBottom: "50px" }} />}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          scrollableTarget="parent"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
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
