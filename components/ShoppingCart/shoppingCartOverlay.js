import { ArrowBackRounded, DeleteRounded } from "@material-ui/icons";
import React from "react";
import {
  CheckoutButton,
  ProudctInfo,
  Wrapper,
} from "./shoppingCartOverlay.styles";
import { useShoppingCart } from "../../context/shoppingCart";
import { Header } from "./shoppingCartOverlay.styles";
import { urlFor } from "../../lib/sanity";
import { AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../utils/currencyFormatter";
import { Button } from "@material-ui/core";

const ShoppingCartOverlay = () => {
  const { setCartOpen, cartItems, removeFromCart, getTotalCartPrice } =
    useShoppingCart();
  console.log(getTotalCartPrice());
  return (
    <Wrapper initial={{ y: "100vh" }} animate={{ y: 0 }} exit={{ y: "100vh" }}>
      <Header>
        <button
          onClick={() => {
            setCartOpen(false);
          }}
        >
          <ArrowBackRounded />
        </button>
        <span style={{ fontWeight: 500 }}>Cart</span>
      </Header>
      <AnimatePresence>
        {cartItems.map((item) => (
          <ProudctInfo layout key={item._id} transition={{ type: "tween" }}>
            <img
              id="product-image"
              src={urlFor(item.defaultProductVariant.images[0]).url()}
              alt="prouduct image"
            />
            <div id="product-info-wrapper">
              <div id="product-details">
                <span
                  style={{
                    fontWeight: 600,
                    width: "28vmin",
                    overflow: "hidden",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </span>
                <span>{formatCurrency(item.defaultProductVariant.price)}</span>
              </div>
              <div id="product-total-cost">
                {formatCurrency(item.totalPrice)}
              </div>
            </div>
            <button
              onClick={() => {
                removeFromCart(item._id);
              }}
              id="remove-product"
            >
              <DeleteRounded fontSize="small" color="error" />
            </button>
          </ProudctInfo>
        ))}
        <CheckoutButton layout key="3">
          <div id="button-content-wrapper">
            <div>Proceed to checkout</div>
            <div id="checkout-price">{formatCurrency(getTotalCartPrice())}</div>
          </div>
        </CheckoutButton>
      </AnimatePresence>
    </Wrapper>
  );
};

export default ShoppingCartOverlay;
