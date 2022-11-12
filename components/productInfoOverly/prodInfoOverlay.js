import React, { useEffect, useState } from "react";
import {
  CartButtons,
  ProductInfoSection,
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
  console.log(currentProduct, "this is where it all ends");
  const router = useRouter();
  const { modifyItemQuantity, getItemQuantity } = useShoppingCart();

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
        <h4 id="currentProductTitle">{currentProduct.title}</h4>
        <h1 id="currentProductPrice">
          {formatCurrency(currentProduct?.defaultProductVariant?.price)}
        </h1>
        <div id="productSizeAndColourContainer">
          <div id="overallSizeContainer">
            <h3 id="sizeOrColourText">Select Size</h3>
            <div id="sizePickerContainer">
              <h4 className="individualSizes">S</h4>
              <h4 className="individualSizes">M</h4>
              <h4 className="individualSizes">L</h4>
              <h4 className="individualSizes xlAndxxlSizes">XL</h4>
              <h4 className="individualSizes xlAndxxlSizes">XXL</h4>
              <h4 className="individualSizes xxxlSize">XXXL</h4>
            </div>
          </div>
          <div id="overallColourContainer">
            <h3 id="sizeOrColourText">Select Colour</h3>
            <div id="colourPickerContainer">
              <h4 className="individualColours">Black</h4>
              <h4 className="individualColours">White</h4>
              <h4 className="individualColours">Blue</h4>
              <h4 className="individualColours">Red</h4>
              <h4 className="individualColours">Gray</h4>
            </div>
          </div>
        </div>

        <div id="productDescriptionDropdowns">
          <Accordion className="individual-pd-Dropdown">
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
          <Accordion className="individual-pd-Dropdown">
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <h3>Reviews</h3>
            </AccordionSummary>
            <AccordionDetails>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                eget.
              </p>
            </AccordionDetails>
          </Accordion>
          <Accordion className="individual-pd-Dropdown">
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
          <Accordion className="individual-pd-Dropdown">
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
        </div>
        <div id="vendorDetailsContainer">
          <h3>About this vendor</h3>
          <div id="vendorInfoandPicturer"></div>
          <a className="invertedBtn longBtn">Click me</a>
        </div>
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
        <h2 className="moreFromVendor">More from this vendor</h2>
        <VendorProductsWrapper>
          {currentProduct?.moreFromVendor?.map((product) => (
            <Link
              href={`/product/${product.slug.current}`}
              passHref
              scroll
              key={product._id}
            >
              <VendorProduct whileTap={{ scale: 0.9 }}>
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
                  <div id="productPriceAndMoreIcon">
                    <h2>
                      {formatCurrency(product.defaultProductVariant.price)}
                    </h2>
                  </div>

                  <p>{product.title}</p>
                </div>
              </VendorProduct>
            </Link>
          ))}
          {currentProduct.moreFromVendor.length === 0 ? (
            <p>No more proudcts from this vendor</p>
          ) : null}
        </VendorProductsWrapper>
        <h2 className="moreFromVendor">Recently viewed</h2>
      </ProductInfoSection>
    </Wrapper>
  );
};

export default ProductInfoOverlay;
