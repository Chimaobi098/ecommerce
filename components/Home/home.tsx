import React, { useRef } from "react";
import { useState } from "react";
import { sanityClient, urlFor } from "../../lib/sanity";
import { Wrapper, NavBar } from "./home.styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { useShoppingCart } from "../../context/shoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { HomeProduct } from "../../pages";
import ProductContainer from "./productItem/productContainer";

const Home = ({ results }: HomeProduct) => {
  const { getCartQuantity, cartOpen, setCartOpen } = useShoppingCart();
  const { user, error } = useUser();
  const [productData, setProductData] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  const [userLikedProducts, setUserLikedProducts] = useState();
  const lastId = useRef<string | null>(results[results.length - 1]._id);
  console.log(results);

  useEffect(() => {
    async function likedProducts() {
      if (!user) return;
      let response = await sanityClient.fetch(
        `*[_type == "users" && userId == $curr] {
     likedProducts

    }`,
        { curr: user?.sub }
      );
      console.log(response, "thisisit");
      console.log(response, "this is it");
      let likedProductsArray = response[0]?.likedProducts;
      setUserLikedProducts(likedProductsArray || []);
    }
    likedProducts();
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
      <NavBar>
        <header>Home</header>
        <Button
          onClick={() => {
            setCartOpen(true);
          }}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            color: "grey",
          }}
        >
          <Badge
            badgeContent={getCartQuantity()}
            color="error"
            overlap="rectangular"
          >
            <LocalMallIcon fontSize="medium" style={{ color: "black" }} />
          </Badge>
        </Button>
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
          {productData.map((product) => (
            <ProductContainer
              productProps={product}
              userLikedProducts={userLikedProducts}
              key={product._id}
            />
          ))}
        </InfiniteScroll>
      </Wrapper>
    </>
  );
};

export default Home;
