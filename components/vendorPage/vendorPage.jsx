import { Button } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import { urlFor } from "../../lib/sanity";

import {
  ProductImageWrapper,
  VendorInfo,
  VendorNav,
  Wrapper,
} from "./vendorPage.styles";

const VendorPage = ({ vendorData }) => {
  const router = useRouter();
  return (
    <>
      <VendorNav>
        <header>{vendorData.title}</header>
      </VendorNav>
      <Wrapper>
        <VendorInfo>
          <div id="vendor-imgandinfo-container">
            <img
              src={urlFor(vendorData.logo)}
              alt="vendor image"
              id="vendor-image"
            />
            <div id="vendor-info-wrapper">
              <div className="vendor-info-items">
                <h3>200</h3>
                <span>Items</span>
              </div>
              <div className="vendor-info-items">
                <h3>200</h3>
                <span>Followers</span>
              </div>
              <div className="vendor-info-items">
                <h3>200</h3>
                <span>Likes</span>
              </div>
            </div>
          </div>

          <div id="vendor-bio">
            <p className="vendorTitleWebsite">{vendorData.title}.com</p>
            <p>🌎Global Fashion Brand</p>
            <p>✈️Fast Shipping Worldwide</p>
            <p>🔥Shop Now⬇️</p>
            <p className="vendorWebsiteLink">
              www.{vendorData.title}.com/collection/new
            </p>
          </div>
        </VendorInfo>
        <Button className="invertedBtn longBtn">Follow</Button>
        <div id="vendor-nav">
          <button>i</button>
          <button>m</button>
          <button>h</button>
        </div>
        <ProductImageWrapper>
          {vendorData.vendorProducts ? (
            vendorData.vendorProducts.map((item) => (
              <motion.div
                className="image-wrapper"
                key={item._id}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  router.push(`/product/${item.slug.current}`);
                }}
              >
                <img
                  src={urlFor(item.defaultProductVariant.images[0])
                    .width(300)
                    .height(300)}
                  id="product-image"
                />
              </motion.div>
            ))
          ) : (
            <p>No more products from this vendor</p>
          )}
        </ProductImageWrapper>
      </Wrapper>
    </>
  );
};

export default VendorPage;
