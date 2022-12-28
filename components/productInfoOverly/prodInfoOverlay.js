import React, { useEffect, useState } from "react";
import {
  CartButtons,
  ProductInfoSection,
  VendorPage,
  VendorProduct,
  VendorProductsWrapper,
  Wrapper,
} from "./prodInfoOverlay.styles";
import { urlFor } from "../../lib/sanity";
import { formatCurrency } from "../../utils/currencyFormatter.ts";
import { CloseMenu } from "./prodInfoOverlay.styles";
import { motion } from "framer-motion";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { useShoppingCart } from "../../context/shoppingCart";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

const ProductInfoOverlay = ({ currentProduct }) => {
  const router = useRouter();
  const { modifyItemQuantity, getItemQuantity } = useShoppingCart();
  console.log(currentProduct);
  const cartButtonState = () => {
    if (getItemQuantity(currentProduct._id) == null) return "Add to cart";
    if (getItemQuantity(currentProduct._id) !== itemQuantity) {
      return "Update quantity";
    } else {
      return "In cart";
    }
  };

  const [itemQuantity, setItemQuantity] = useState(
    getItemQuantity(currentProduct._id) || 1
  );

  const increment = () => {
    setItemQuantity((prev) => prev + 1);
  };

  const decrement = () => {
    if (itemQuantity === 1) return;
    setItemQuantity((prev) => prev - 1);
  };

  return (
    <Wrapper
      initial={{ y: "100vh" }}
      animate={{ y: "0vh" }}
      exit={{ y: "100vh" }}
    >
      <div style={{ width: "100%", height: "40vh", position: "relative" }}>
        <Image
          layout="fill"
          objectFit="contain"
          src={urlFor(currentProduct.defaultProductVariant?.images[0]).url()}
          alt="Product Image"
        />
      </div>
      <ProductInfoSection>
        <CloseMenu
          onClick={() => {
            router.back();
          }}
        >
          <CloseRoundedIcon />
        </CloseMenu>
        <h4>{currentProduct.title}</h4>
        <h1>{formatCurrency(currentProduct?.defaultProductVariant?.price)}</h1>
        <CartButtons primary>
          <div id="quantity-control-container">
            <button
              className="quantity-change-buttons"
              onClick={() => {
                decrement();
              }}
            >
              {<RemoveRoundedIcon />}
            </button>
            <div id="quantity">{itemQuantity}</div>
            <button
              className="quantity-change-buttons"
              onClick={() => {
                increment();
              }}
            >
              {<AddRoundedIcon />}
            </button>
          </div>
          <button
            id="add-to-cart"
            onClick={() => {
              if (cartButtonState() == "In cart") return;
              modifyItemQuantity(currentProduct, itemQuantity);
            }}
          >
            {cartButtonState()}
          </button>
        </CartButtons>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <h3>Product Description</h3>
          </AccordionSummary>
          <AccordionDetails>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <h3>Size Guide</h3>
          </AccordionSummary>
          <AccordionDetails>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
            <h3>Shipping Info</h3>
          </AccordionSummary>
          <AccordionDetails>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </p>
          </AccordionDetails>
        </Accordion>
        <VendorPage>
          <div id="vendorData">
            <p id="vendor-title">{currentProduct.vendor.title}</p>
            <p id="more-vendor-info">
              {`${currentProduct.vendorProductCount} Products Available`}
            </p>
          </div>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Link href={`/vendor/${currentProduct.vendor._id}`}>
              <Image
                src={urlFor(currentProduct.vendor.logo).url()}
                alt="vendorLogo"
                height={"60rem"}
                width={"60rem"}
              />
            </Link>
          </motion.div>
        </VendorPage>
        <h2 style={{ marginTop: "50px" }}>More from this vendor</h2>
        <VendorProductsWrapper>
          {currentProduct?.moreFromVendor?.map((product, i) => (
            <Link
              href={`/product/${product.slug.current}`}
              passHref
              scroll
              key={i}
            >
              <VendorProduct whileTap={{ scale: 0.9 }} key={product._id}>
                <div
                  style={{ width: "100%", height: "70%", position: "relative" }}
                >
                  <Image
                    layout="fill"
                    objectFit="cover"
                    src={urlFor(product.defaultProductVariant.images[0]).url()}
                    alt="Product Image"
                  />
                </div>
                <div style={{ padding: "0 0.5rem" }}>
                  <h2>{formatCurrency(product.defaultProductVariant.price)}</h2>
                  <p>{product.title}</p>
                </div>
              </VendorProduct>
            </Link>
          ))}
          {currentProduct.moreFromVendor.length === 0 ? (
            <p>No more proudcts from this vendor</p>
          ) : null}
        </VendorProductsWrapper>
      </ProductInfoSection>
    </Wrapper>
  );
};

export default ProductInfoOverlay;
