import React, { useRef } from "react";
import { useState } from "react";
import { sanityClient, urlFor } from "../lib/sanity";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import { useEffect } from "react";
import ProductInfoOverlay from "../components/productInfoOverly/prodInfoOverlay";
import { AnimatePresence, motion } from "framer-motion";

const productQuery = `*[_type == 'product'] | order(_id)[0...3]{
  defaultProductVariant,
  _id,
  title,
  vendor->{
  title,
  logo
}
}`;

const Wrapper = styled.div`
  overflow-y: scroll;
  height: 100%;
  background: white;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
const ProductInfo = styled.div`
  // margin-top: -0.1rem;
  // margin-bottom: 8rem;
  width: 100%;
  border-width: 0.1px 0px 0px 0px;
  border-style: solid;
  border-color: #000000;
  // border: 3px solid green;

  //  POST HEADER SECTION
  #postHeader {
    box-sizing: border-box;
    /* Auto layout */
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 16px;
    gap: 16px;
    width: 100%;
    height: 56px;
    margin: 0;
  }

  #vendorName {
    display: flex;
    flex: 1;

    height: 21px;

    /* Category-body-text */
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
    color: #000;
  }

  #productImage {
    width: 100%;
    height: 328px;
    // border: 3px solid cyan;
  }

  #vendorImage {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  // Bottom part of Home Feed

  #bottom-feedCard {
    // border: 3px solid orange;
    // display: flex;
    // flex-direction: column;
  }

  #bottom-feedCard > * {
    margin: 0px 0 8px 0;
    // display: flex;
    // flex-direction: column;
  }

  #action-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border: 1px solid green;
    padding: 0px 16px;
  }

  #left-action-side {
    display: flex;
    gap: 16px;
  }

  #right-action-side {
    display: flex;
  }

  .action-button {
    width: 24px;
    height: 24px;
  }

  #bottom-feedCard > h3 {
    // border: 3px solid lavender;
    padding: 0px 16px;
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    font-size: 1rem;
    // line-height: 21px;
  }

  #vendorName-Caption {
    height: 21px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px 16px 16px;
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    // border: 3px solid black;
  }

  #feedCardCaption {
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 21px;
  }
`;
const Home = ({ results }) => {
  const { user, loading, error } = useUser();
  const [productData, setProductData] = useState(results);
  const [hasMore, setHasMore] = useState(true);
  const lastId = useRef(results[results.length - 1]._id);
  const [currentProudct, setCurrentProduct] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const data = await fetch("/api/users/createUser", {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const final = await data.json();
        console.log(final);
      }
    }
    fetchData();
  }, [user]);

  async function fetchNextPage() {
    console.log("this function is called");
    const { current } = lastId;
    if (current === null) {
      setHasMore(false);
    }
    const data = await sanityClient.fetch(
      `*[_type == "product" && _id > $current] | order(_id) [0...3] {
     defaultProductVariant,
  _id,
  title,
  vendor->{
  title,
  logo
}
    }`,
      { current }
    );
    if (data.length > 0) {
      lastId.current = data[data.length - 1]._id;
      setProductData((prev) => [...prev, ...data]);
      console.log("i did it");
    } else {
      lastId.current = null; // Reached the end
      setHasMore(false);
    }
  }

  return (
    <>
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
              <div id="postHeader">
                <img
                  id="vendorImage"
                  src={urlFor(product.vendor.logo).url()}
                  alt=""
                />
                <h3 id="vendorName"> John Doe</h3>
                <img className="action-button" src="likeButton.svg" alt="" />
              </div>
              <motion.img
                id="productImage"
                src={urlFor(product.defaultProductVariant.images[0])}
                alt="Product Image"
                onClick={() => {
                  setCurrentProduct(product);
                }}
                whileTap={{ scale: 0.9 }}
              />

              <div id="bottom-feedCard">
                <div id="action-section">
                  <div id="left-action-side">
                    <img
                      className="action-button"
                      src="likeButton.svg"
                      alt=""
                    />
                    <img
                      className="action-button"
                      src="commentButton.svg"
                      alt=""
                    />
                    <img
                      className="action-button"
                      src="commentButton.svg"
                      alt=""
                    />
                  </div>
                  <div id="right-action-side">
                    <img
                      className="action-button"
                      src="likeButton.svg"
                      alt=""
                    />
                  </div>
                </div>
                <h3>3000 likes</h3>
                <div id="vendorName-Caption">
                  <p>John Doe</p>
                  <p id="feedCardCaption">placeholder text</p>
                </div>
              </div>
            </ProductInfo>
          ))}
        </InfiniteScroll>
      </Wrapper>
      <AnimatePresence>
        {currentProudct && (
          <ProductInfoOverlay
            currentProduct={currentProudct}
            setCurrentProduct={setCurrentProduct}
            key={currentProudct._id}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Home;

export const getStaticProps = async () => {
  const results = await sanityClient.fetch(productQuery);

  return { props: { results } };
};
