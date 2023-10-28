import  Button  from "@mui/material/Button";
import { AnimatePresence, motion } from "framer-motion";
import Profile from "../../public/216487_add_user_icon.svg";
import { useRouter } from "next/router";
import React from "react";
import { urlFor } from "../../lib/sanity";
import GridOnIcon from "@mui/icons-material/GridOn";
//import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Shopicon from "../../public/Shop.svg";

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
        <Image
           src={Shopicon}
           width={0}
           height={0}
           unoptimized={true}
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
            unoptimized={true}
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
        <div style={{ display: "flex", justifyContent:"flex-end", gap: "1rem"  }}>
        <Button style={{ display: "flex", color: "black", fontWeight: "bold",   width: "35%", background: "grey", borderRadius: "12px"  }}>Follow</Button>
        <Button style={{ display: "flex", border: "1px solid", borderColor: "white", background: "grey", borderRadius: "12px"   }}><Image src={Profile} width={0} height={0} /></Button>
         </div>
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
                      unoptimized={true}
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
      
            </motion.div>
          )}
        </AnimatePresence>
      </Wrapper>
    </>
  );
};

export default VendorPage;
