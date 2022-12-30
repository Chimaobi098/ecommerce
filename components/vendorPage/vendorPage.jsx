import { Button } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

import { useRouter } from "next/router";
import React from "react";
import { urlFor } from "../../lib/sanity";
import GridOnIcon from "@mui/icons-material/GridOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import {
  ProductImageWrapper,
  VendorInfo,
  VendorNav,
  Wrapper,
} from "./vendorPage.styles";
import { useState } from "react";
import Image from "next/image";

const VendorPage = ({ vendorData }) => {
  const router = useRouter();
  const [selected, setSelected] = useState("products");
  const sectionItems = [
    {
      label: "products",
      icon: (
        <GridOnIcon
          style={{ color: selected == "products" ? null : "hsl(0, 0%, 66%)" }}
        />
      ),
    },
    {
      label: "vouchers",
      icon: (
        <LocalOfferIcon
          style={{ color: selected == "vouchers" ? null : "hsl(0, 0%, 66%)" }}
        />
      ),
    },
  ];
  return (
    <>
      <VendorNav>
        <header>{vendorData.title}</header>
      </VendorNav>
      <Wrapper>
        <VendorInfo>
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
              <span>Following</span>
            </div>
            <div className="vendor-info-items">
              <h3>200</h3>
              <span>Likes</span>
            </div>
          </div>
        </VendorInfo>
        <Button style={{ width: "100%" }}>Follow</Button>
        <ul id="sub-nav">
          {sectionItems.map((item, i) => (
            <li
              className="sub-nav-item"
              key={i}
              onClick={() => {
                setSelected(item.label);
              }}
            >
              {item.icon}
              {selected == item.label ? (
                <motion.div
                  initial={{ x: 0, y: 0 }}
                  id="underline"
                  layoutId="underline"
                ></motion.div>
              ) : null}
            </li>
          ))}
        </ul>
        <AnimatePresence exitBeforeEnter>
          {selected == "products" ? (
            <ProductImageWrapper
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ x: "-100vw" }}
              key="1"
            >
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
                    <Image
                      src={urlFor(item.defaultProductVariant.images[0]).url()}
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL="/placeholder.png"
                      id="product-image"
                      alt="product Image"
                      width="300px"
                      height="300px"
                    />
                  </motion.div>
                ))
              ) : (
                <p>No more products from this vendor</p>
              )}
            </ProductImageWrapper>
          ) : (
            <motion.div
              exit={{ x: "100vw" }}
              key="2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {"theres nothing here yet"}
            </motion.div>
          )}
        </AnimatePresence>
      </Wrapper>
    </>
  );
};

export default VendorPage;
