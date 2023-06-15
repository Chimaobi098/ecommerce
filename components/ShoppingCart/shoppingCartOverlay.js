import React, { useState, useEffect } from "react";
import {
  CartItemWrapper,
  CheckoutButton,
  CheckoutButtonWrapper,
  CheckoutDetails,
  ProudctInfo,
  Wrapper,
} from "./shoppingCartOverlay.styles";
import { CartButtons } from "../productInfoOverly/prodInfoOverlay.styles";
import { useShoppingCart } from "../../context/shoppingCart";
import { Header } from "./shoppingCartOverlay.styles";
import { urlFor } from "../../lib/sanity";
import { AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../utils/currencyFormatter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { sanityClient } from "../../lib/sanity"; 
import { useRouter } from "next/router";



const ShoppingCartOverlay = () => {
  const router = useRouter();
  const { setCartOpen, cartItems, removeFromCart,increaseCart,decreaseCart, getTotalCartPrice } =
    useShoppingCart();
  
  function handleClick() {
    setCartOpen(false);
    router.push("/checkout");
  }


  return (
    <Wrapper initial={{ y: "100vh" }} animate={{ y: 0 }} exit={{ y: "100vh" }}>
      <Header>
        <button
          onClick={() => {
            setCartOpen(false);
          }}
        >
          <ClearOutlinedIcon />
        </button>
        <span style={{ fontWeight: 500 }}>Bag</span>
        <div></div>
      </Header>
      <AnimatePresence>
        <CartItemWrapper>
          {cartItems.map((item) => 
          
          (
            <ProudctInfo className="h-40 px-2 pt-2 border-t border-t-gray-700" key={item._id} transition={{ type: "tween" }}>
              
              <img
              
                id="product-image"
                src={urlFor(
                  item.isVariant
                    ? item?.images[0]
                    : item?.defaultProductVariant.images[0]
                ).url()}
                alt="prouduct image"
                className="h-40"
              />
              <div id="product-info-wrapper">
                <div id="product-details" className="h-40 gap-y-20 text-xl">
                  <span
                    style={{
                      fontWeight: 400,
                      overflow: 'Hidden',
                      width: "100%",
                      display: "inline-block",
                      
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </span>
                  <span>
                    {formatCurrency(
                      item.isVariant
                        ? item.price
                        : item.defaultProductVariant.price
                    )}
                  </span>
                </div>
                {/* <div id="product-total-cost">
                  {formatCurrency(item.totalPrice)}
                </div> */}
              </div>
              <div className="flex flex-col gap-y-20">
              <button
                onClick={() => {
                  removeFromCart(item._id);
                }}
                id="remove-product"
              >
                <DeleteRoundedIcon fontSize="small" color="error" />
              </button>
              <div className="flex flex-row w-20 cursor-pointer justify-evenly text-xl">
                <div onClick={() => {
                  decreaseCart(item._id);
                }}>-</div>
                <div className="bg-gray-300 px-2 text-base flex items-center">{item.quantity}</div>
                <div onClick={() => {
                  increaseCart(item._id);
                }}>+</div>
              </div>
              </div>
            </ProudctInfo>
          ))}
        </CartItemWrapper>
        <CheckoutDetails className="">
          <div id="cart-details-wrapper">
            <div id="cart-item-count">{cartItems.length} items</div>
            <div id="checkout-price">
              Total:{" "}
              <span id="price">{formatCurrency(getTotalCartPrice())}</span>
            </div>
          </div>
          <hr />

          <div className=" flex flex-row h-12 w-full justify-evenly mt-2 px-2 gap-x-4">
          <button className="bg-black h-full rounded-md w-full text-white" onClick={handleClick}>
            Checkout
          </button>
          {/* <button className="text-black h-full rounded-md w-6/12 bg-white border border-black">
            Play
          </button> */}
          </div>
        </CheckoutDetails>
      </AnimatePresence>
    </Wrapper>
  );
};

export default ShoppingCartOverlay;


