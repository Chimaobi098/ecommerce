import React, { useState, useEffect, useRef } from "react";
import {
  CartItemWrapper,
  Deletebutton,
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
import { Swipeable } from 'react-swipeable';



const ShoppingCartOverlay = () => {
  const router = useRouter();
  const { setCartOpen, cartItems, handleItemClick, removeFromCart,increaseCart,decreaseCart, getTotalCartPrice } =
    useShoppingCart();
  
    // const ref = useRef();
    // let downX;

    // const onPointerMove = (e) =>{
    //   const newX = e.clientX;
    //   if(newX - downX < -30){
    //     ref.current.style.transform = "translate(-55px)";
    //   } else ref.current.style.transform = "translate(100%)";

    // };
    // const onPointerDown = (e) =>{
    //   downX = e.clientX;
    //   ref.current.addEventListener("pointermove", onPointerMove)
    // };
    // const onPointerUp = () =>
    // ref.current.removeEventListener("pointermove", onPointerMove);


    // const [startX, setStartX] = useState(0);
    // const [endX, setEndX] = useState(0);
  
    // Handle the start of touch event


    // const handleTouchStart = (event) => {
    //   const touch = event.touches[0];
    //   setStartX(touch.clientX);
    // };
  
    // Handle the end of touch event
    // const handleTouchEnd = (event, id) => {
    //   const touch = event.changedTouches[0];
    //   setEndX(touch.clientX);
  
    //   // Calculate the difference between start and end positions
    //   const deltaX = endX - startX;
  
    //   // Move the div to the right if the swipe is greater than a threshold
    //   if (deltaX > 100) {
    //     cartItems.map((item)=>{
    //       if(item._id === id){
    //         divRef.current.style.transform = 'translateX(100%)';
    //       }

    //     })
        
    //   }
    // };

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
            <ProudctInfo 
            // onClick={() => handleItemClick(item._id)} 
            className="h-40 pl-2 -mr-4 pt-2 relative border-t border-t-gray-700" key={item._id} transition={{ type: "tween" }}
            >
              
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
              <div className=" h-40 flex flex-col justify-between w-full pl-2">
                <div className="flex flex-row justify-between">
                <div className=" text-xl w-9/12">
                  <span>
                    {item.title}
                  </span>

                </div>
                <div className="w-3/12 flex justify-center">
                <button
              className="text-black"
              onClick={() => {
                removeFromCart(item._id);
              }}
                
                id="remove-product"
              >
                <DeleteRoundedIcon fontSize="medium" />
              </button>
              </div>
              </div>
                {/* <div id="product-total-cost">
                  {formatCurrency(item.totalPrice)}
                </div> */}

      <div className="flex justify-between">
                <div>
                <span className="text-xl">
                    {formatCurrency(
                      item.isVariant
                        ? item.price
                        : item.defaultProductVariant.price
                    )}
                  </span>
                </div>
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
              </div>

               {/* <Deletebutton onClick={() => {
                removeFromCart(item._id);
              }}> */}

              {/* </Deletebutton> */}
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

          <div className=" flex flex-row h-12 w-full justify-evenly mt-2 mb-8 lg:mb-0 px-2 gap-x-4">
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


