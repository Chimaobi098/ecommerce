import React, { useEffect } from "react";
import {
  CheckoutButton,
  ProudctInfo,
  Wrapper,
} from "./shoppingCartOverlay.styles";
import { useShoppingCart } from "../../context/shoppingCart";
import { Header } from "./shoppingCartOverlay.styles";
import { urlFor } from "../../lib/sanity";
import { AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../utils/currencyFormatter.ts";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useRouter } from "next/router";

const ShoppingCartOverlay = () => {
  const router = useRouter();
  const { setCartOpen, cartItems, removeFromCart, getTotalCartPrice } =
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
          <ArrowBackIcon />
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
                    width: "100%",
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
              <DeleteRoundedIcon fontSize="small" color="error" />
            </button>
          </ProudctInfo>
        ))}
        <CheckoutButton layout key="3" onClick={handleClick}>
          <span>Proceed to checkout</span>
          <div id="checkout-price">{formatCurrency(getTotalCartPrice())}</div>
        </CheckoutButton>
      </AnimatePresence>
    </Wrapper>
  );
};

export default ShoppingCartOverlay;
