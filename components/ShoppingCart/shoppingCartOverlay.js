import React, { useState, useEffect, useRef } from "react";
import {
  CartItemWrapper,
  Deletebutton,
  CheckoutButton,
  CheckoutButtonWrapper,
  CheckoutDetails,
  ProudctInfo,
  Wrapper,
  ProductInfoWrapper,
} from "./shoppingCartOverlay.styles";
import { CartButtons } from "../productInfoOverly/prodInfoOverlay.styles";
import { useShoppingCart } from "../../context/shoppingCart";
import { Header } from "./shoppingCartOverlay.styles";
import { urlFor } from "../../lib/sanity";
import { AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../utils/currencyFormatter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { sanityClient } from "../../lib/sanity";
import { useRouter } from "next/router";
import { Swipeable } from "react-swipeable";
import { Button } from "@mui/material";

const ShoppingCartOverlay = () => {
  const router = useRouter();
  const {
    setCartOpen,
    cartItems,
    handleItemClick,
    removeFromCart,
    increaseCart,
    decreaseCart,
    getTotalCartPrice,
  } = useShoppingCart();

  function handleClick() {
    setCartOpen(false);
    router.push("/checkout");
  }
  const [dragItems, setDragItems] = useState(
    cartItems.map((item) => {
      return { productId: item._id, isShowingDelete: false };
    })
  );

  function handleDragEnd(event, id) {
    const dragOffset = 600; // smaller means draw futher back for delete

    if (event.x > dragOffset) {
      setDragItems((prev) => {
        const newDragging = [...prev];
        const finalDragging = newDragging.map((draggingItem) => {
          if (draggingItem.productId == id) {
            draggingItem.isShowingDelete = false;
          }
          return draggingItem;
        });
        console.log(finalDragging);
        return finalDragging;
      });
    }
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
          {cartItems.map((item, i) => {
            const currentItemState = dragItems.find(
              (dragItem) => item._id == dragItem.productId
            );
            console.log("this is the current item state", currentItemState);
            return (
              <ProductInfoWrapper key={item}>
                <Button
                  onClick={() => {
                    removeFromCart(item._id);
                  }}
                >
                  <DeleteRoundedIcon sx={{ color: "white" }} />
                </Button>
                <ProudctInfo
                  // onClick={() => handleItemClick(item._id)}
                  className="h-40 pl-2 -mr-4 pt-2 relative border-t border-t-gray-700"
                  key={item._id}
                  transition={{ type: "tween" }}
                  drag="x"
                  onDragStart={(event, info) => {
                    setDragItems((prev) => {
                      const newDragging = [...prev];
                      const finalDragging = newDragging.map((draggingItem) => {
                        if (draggingItem.productId == item._id) {
                          draggingItem.isShowingDelete = true;
                        }
                        return draggingItem;
                      });
                      console.log(finalDragging);
                      return finalDragging;
                    });
                  }}
                  onDragEnd={(event) => handleDragEnd(event, item._id)}
                  dragSnapToOrigin
                  style={{
                    left: `-${currentItemState?.isShowingDelete ? 100 : 0}px`,
                    bottom: -12.7,
                  }}
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
                        <span>{item.title}</span>
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
                        <div
                          onClick={() => {
                            decreaseCart(item._id);
                          }}
                        >
                          -
                        </div>
                        <div className="bg-gray-300 px-2 text-base flex items-center">
                          {item.quantity}
                        </div>
                        <div
                          onClick={() => {
                            increaseCart(item._id);
                          }}
                        >
                          +
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <Deletebutton onClick={() => {
                removeFromCart(item._id);
              }}> */}

                  {/* </Deletebutton> */}
                </ProudctInfo>
              </ProductInfoWrapper>
            );
          })}
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
            <button
              className="bg-black h-full rounded-md w-full text-white"
              onClick={handleClick}
            >
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
