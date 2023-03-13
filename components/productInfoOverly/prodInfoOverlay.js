import React, { useEffect, useState } from "react";
import {
  CartButtons,
  ProductInfoSection,
  ProudctVariantBackground,
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
import Head from "next/head";
import ProductVariant from "./productVariant";
import DefaultProduct from "./defaultProduct";

const ProductInfoOverlay = ({ currentProduct }) => {
  const router = useRouter();
  const [variantButtonState, setVariantButtonState] = useState("not-selected"); // either not-selected or selected
  const { modifyItemQuantity, getItemQuantity } = useShoppingCart();
  const [overlayVisibility, setOverlayVisibility] = useState(false);
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
    <>
      <Head>
        <title>{`Ecommerce || ${currentProduct.title}`}</title>
        <meta
          name="description"
          content="This is a really cool product that I think you should buy"
        />
        <meta
          name="image"
          content={urlFor(
            currentProduct.defaultProductVariant?.images[0]
          ).url()}
        />
      </Head>
      <Wrapper initial={{ y: "100vh" }} animate={{ y: "0vh" }}>
        <div style={{ width: "100%", height: "40vh", position: "relative" }}>
          <Image
            layout="fill"
            objectFit="cover"
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
          <h1>
            {formatCurrency(currentProduct?.defaultProductVariant?.price)}
          </h1>
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
                if (currentProduct.variants) {
                  setOverlayVisibility(true);
                } else {
                  if (cartButtonState() == "In cart") return;
                  modifyItemQuantity(currentProduct, itemQuantity);
                }
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
                {`${currentProduct.vendorProductCount} Product${
                  currentProduct.vendorProductCount == 1 ? "" : "s"
                } Available`}
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
                    style={{
                      width: "100%",
                      height: "70%",
                      position: "relative",
                    }}
                  >
                    <Image
                      layout="fill"
                      objectFit="cover"
                      src={urlFor(
                        product.defaultProductVariant.images[0]
                      ).url()}
                      alt="Product Image"
                    />
                  </div>
                  <div style={{ padding: "0 0.5rem" }}>
                    <h2>
                      {formatCurrency(product.defaultProductVariant.price)}
                    </h2>
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
      {overlayVisibility && (
        <ProudctVariantBackground
          id="variant-background"
          onClick={(e) => {
            console.log(e.target.id);
            if (e.target.id == "variant-background") {
              setOverlayVisibility(false);
            }
          }}
        >
          <motion.div
            id="overlay-container"
            initial={{ y: "70vh" }}
            animate={{ y: "0vh" }}
          >
            <p>Choose A Variant</p>
            <DefaultProduct
              productInfo={currentProduct}
              variantButtonState={variantButtonState}
            />
            {currentProduct.variants.map((variant) => (
              <ProductVariant
                key={variant._key}
                productInfo={variant}
                productId={currentProduct._id}
                variantButtonState={variantButtonState}
              ></ProductVariant>
            ))}
          </motion.div>
          <button
            id="add-variants-to-cart"
            onClick={() => {
              setVariantButtonState("selected");

              alert("your items have been added to the cart");
            }}
          >
            Add To Cart
          </button>
        </ProudctVariantBackground>
      )}
    </>
  );
};

export default ProductInfoOverlay;
