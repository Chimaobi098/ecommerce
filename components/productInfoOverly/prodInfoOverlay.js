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
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useShoppingCart } from "../../context/shoppingCart";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import ProductVariant from "./productVariant";
import DefaultProduct from "./defaultProduct";
import DefaultColor from "./defaultColor";
import DefaultSize from "./defaultSize";
import ProductColor from "./productColor";


import { useUser } from "@auth0/nextjs-auth0";
import { usePaystackPayment } from "react-paystack";

const ProductInfoOverlay = ({ currentProduct }) => {
  const router = useRouter();
  const { user, error } = useUser();
  const [variantButtonState, setVariantButtonState] = useState("not-selected"); // either not-selected or selected
  const { modifyItemQuantity, getItemQuantity, variantId } = useShoppingCart();
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
    console.log(res);
    if (res._id) {
      window.location.href = `https://long1sland.github.io/wordsearch?sessionId=${res._id}`;
    } else {
      alert("there was an error contact us");
    }
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
            
          </div>

          <h1>
            {formatCurrency(currentProduct?.defaultProductVariant?.price)}
          </h1>
            {/* <div id="quantity-control-container">
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
            </div> */}
            <div className="w-full h-auto flex flex-grow justify-evenly text-white my-8">
            <button
            className="bg-[#0aad0a] hover:bg-[green] w-5/12 rounded-md h-12"
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
            <button
            className="bg-[#de5d17] hover:bg-[#be541a] w-5/12 h-12 rounded-md"
              onClick={() => {
                if (user) {
                  setShowGameSettingsOverlay(true);
                  return;
                }

                router.replace("/api/auth/login");
              }}
            >
              Play
            </button>
            </div>
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
            <p className="w-full"><ArrowBackIosNewIcon onClick={(e)=>{setShowGameSettingsOverlay(false);}} /></p>
            <form className="w-full h-auto" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-y-16 mt-8">
              <div className="flex flex-col w-full gap-y-2">
                <label className="md:text-lg font-bold">Number of attempts:</label>
              <input
              className="w-full border-2 rounded-md h-12 p-2"
                placeholder="how many attempts do you want?"
                value={numberOfAttempts}
                type="number"
                required
                onChange={(e) => {
                  setNumberOfAttempts(e.target.value);
                }}
              />
              </div>
                      <div className="flex flex-col w-full gap-y-2">  
                      <label className="md:text-lg font-bold">Amount needed to pay:</label>
                        <input
                            className="w-full border-2 rounded-md h-12 p-2"
                placeholder="how many attempts do you want?"
                value={numberOfAttempts}
                type="number"
                required
                // onChange={(e) => {
                //   setNumberOfAttempts(e.target.value);
                // }}
              />
              </div>
              </div>

              {/* <span>Total cost: {formatCurrency(numberOfAttempts * 100)}</span> */}
             <button
          className=" fixed bottom-0  md:right-0 bg-black text-white w-11/12 md:w-[420px] h-12 mb-12 md:mb-6 rounded-sm md:mx-4" type="submit">pay</button>

      
            </form>
          </motion.div>
        </ProudctVariantBackground>
      )}
      {overlayVisibility && (
        <ProudctVariantBackground
          id="variant-background"
          onClick={(e) => {
            // console.log(e.target.id);
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
        <CloseMenu
        className="cursor-pointer"
            onClick={() => {
              setOverlayVisibility(false);
            }}
          >
            <CloseRoundedIcon />
          </CloseMenu>
            <div className="text-left w-full mb-4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <h4 style={{ margin: "0" }}>{currentProduct.title}</h4>
            
          </div>

          <h1>
            {formatCurrency(currentProduct?.defaultProductVariant?.price)}
          </h1>
          </div>

          <div className="flex-col w-full ">
  {currentProduct.variants.map((variant) => {
    if (variantId === variant._key) {
      return (
        <ProductColor
          key={variant._key}
          productInfo={variant}
          productId={currentProduct._id}
          variantButtonState={variantButtonState}
        />
      );
    } else {
      return null;
    }
  })}

  {variantId === currentProduct.defaultProductVariant?.sku && (
    <DefaultColor
      productInfo={currentProduct}
      variantButtonState={variantButtonState}
    />
  )}
</div>


        <div className="w-full flex flex-row gap-x-2 items-center mt-2">
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

        </div>

        <DefaultSize
              productInfo={currentProduct}
              variantButtonState={variantButtonState}
            />

            <div className="fixed bottom-0 px-4 pt-0 md:pt-8 bg-white h-24 w-full">
          <button
          className="w-full m-auto bg-black text-white h-12 rounded-sm"
          
            onClick={() => {
              setVariantButtonState("selected");

              alert("your items have been added to the cart");
            }}
          >
            Next
          </button>

          </div>
          </motion.div>

        </ProudctVariantBackground>
        
      )}

    </>
  );
};

export default ProductInfoOverlay;
