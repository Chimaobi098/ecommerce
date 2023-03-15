import React, { useEffect, useState } from "react";
import {
  CartButtons,
  PlayButton,
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
import { useUser } from "@auth0/nextjs-auth0";
import { usePaystackPayment } from "react-paystack";

const ProductInfoOverlay = ({ currentProduct }) => {
  const router = useRouter();
  const { user, error } = useUser();
  const [variantButtonState, setVariantButtonState] = useState("not-selected"); // either not-selected or selected
  const { modifyItemQuantity, getItemQuantity } = useShoppingCart();
  const [overlayVisibility, setOverlayVisibility] = useState(false);
  const [showGameSettingsOverlay, setShowGameSettingsOverlay] = useState(false);
  const [numberOfAttempts, setNumberOfAttempts] = useState(0);
  console.log(currentProduct, "this is the current Product");
  const cartButtonState = () => {
    if (getItemQuantity(currentProduct._id) == null) return "Add to cart";
    if (getItemQuantity(currentProduct._id) !== itemQuantity) {
      return "Update quantity";
    } else {
      return "In cart";
    }
  };

  const config = {
    email: user?.email,
    amount: numberOfAttempts * 100 * 100, // converting to kobo for paystack and multiplying by 100 (1attempt = 100naira)
    publicKey: process.env.PAYSTACK_PUBLIC_KEY,
  };
  const initializePayment = usePaystackPayment(config);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    initializePayment(onSuccess, onClose);
  };

  async function onSuccess() {
    let data = await fetch("/api/manageGameAttempts", {
      method: "POST",
      body: JSON.stringify({
        numberOfAttempts,
        productId: currentProduct._id,
      }),
    });
    let res = await data.json();
    window.location.href = `https://long1sland.github.io/wordsearch?sessionId=${res.sessionId}`;
    console.log(res);
  }

  function onClose() {
    alert("just try again");
  }
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
        <div
          style={{
            width: "100%",
            height: "40vh",
            position: "relative",
            marginBottom: "2rem",
          }}
        >
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h4 style={{ margin: "0" }}>{currentProduct.title}</h4>
            <PlayButton
              onClick={() => {
                if (user) {
                  setShowGameSettingsOverlay(true);
                  return;
                }

                router.replace("/api/auth/login");
              }}
            >
              Play
            </PlayButton>
          </div>

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
      {showGameSettingsOverlay && (
        <ProudctVariantBackground
          id="variant-background"
          onClick={(e) => {
            console.log(e.target.id);
            if (e.target.id == "variant-background") {
              setShowGameSettingsOverlay(false);
            }
          }}
        >
          <motion.div
            id="overlay-container"
            initial={{ y: "70vh" }}
            animate={{ y: "0vh" }}
          >
            <p>Set up Your Game</p>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="how many attempts do you want?"
                value={numberOfAttempts}
                type="number"
                required
                onChange={(e) => {
                  setNumberOfAttempts(e.target.value);
                }}
              />

              <span>Total cost: {formatCurrency(numberOfAttempts * 100)}</span>
              <button type="submit">pay</button>
            </form>
          </motion.div>
        </ProudctVariantBackground>
      )}
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
