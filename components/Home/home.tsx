import React, { useRef } from "react";
import { useState } from "react";
import { sanityClient, urlFor } from "../../lib/sanity";
import { Wrapper, NavBar, ProductInfo } from "./home.styles";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Badge from "@mui/material/Badge";
import { useShoppingCart } from "../../context/shoppingCart";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import { HomeProduct } from "../../pages";
import Image from "next/image";

const Home = ({ results }: HomeProduct) => {
  console.log;
  const router = useRouter();
  const { getCartQuantity, cartOpen, setCartOpen } = useShoppingCart();
  const { user, error } = useUser();
  const [productData, setProductData] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  const lastId = useRef<string | null>(results[results.length - 1]._id);
  const [likes, setLikes] = useState({ likeCount: 300, likeState: false });

  function handleLikes() {
    setLikes((prev) => {
      if (prev.likeState) {
        return { likeCount: prev.likeCount - 1, likeState: false };
      }
      return { likeCount: prev.likeCount + 1, likeState: true };
    });
  }

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
}
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
  console.log(user);

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
            <ProductInfo key={product._id}>
              <div id="vendor-info-container">
                <Image
                  placeholder="blur"
                  blurDataURL="/placeholder.png"
                  className="vendorImage"
                  width={40}
                  height={40}
                  src={urlFor(product.vendor.logo).url()}
                  alt={product.title}
                  onClick={() => {
                    router.push(`/vendor/${product.vendor._id}`);
                  }}
                />
                <span id="vendorName">{product.vendor.title}</span>
              </div>
              <motion.div
                whileTap={{ scale: 0.9 }}
                style={{ width: "100%", height: "45vh", position: "relative" }}
              >
                <Image
                  placeholder="blur"
                  blurDataURL="/placeholder.png"
                  layout="fill"
                  objectFit="contain"
                  src={urlFor(product.defaultProductVariant.images[0]).url()}
                  alt="Product Image"
                  onClick={() => {
                    router.push(`/product/${product.slug.current}`);
                  }}
                />
              </motion.div>

              <div id="bottom-feedCard">
                <div id="action-section">
                  <div id="left-action-side">
                    <motion.div whileTap={{ scale: 0.8 }} onClick={handleLikes}>
                      {likes.likeState ? (
                        <FavoriteIcon fontSize="large" color="error" />
                      ) : (
                        <FavoriteBorderIcon fontSize="large" />
                      )}
                    </motion.div>
                    <CommentRoundedIcon fontSize="large" />
                  </div>
                  <div id="right-action-side">
                    {/* <CommentRoundedIcon fontSize="large" /> */}
                  </div>
                </div>
                <h4>{`${likes.likeCount} likes`}</h4>
                <div id="vendorName-Caption">
                  <p>{product.vendor.title}</p>
                  <p id="feedCardCaption">placeholder text</p>
                </div>
              </div>
            </ProductInfo>
          ))}
        </InfiniteScroll>
      </Wrapper>
    </>
  );
};

export default Home;
