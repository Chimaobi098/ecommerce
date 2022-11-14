import { AnimatePresence } from "framer-motion";
import React, { useContext, createContext, ReactNode } from "react";
import { useState } from "react";
import ShoppingCartOverlay from "../components/ShoppingCart/shoppingCartOverlay";

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export const useShoppingCart = () => useContext(ShoppingCartContext);

interface ShoppingCartProviderProps {
  children: ReactNode;
}

interface ShoppingCartContext {
  modifyItemQuantity: (
    productInfo: ProductInfo,
    productQuantity: number
  ) => void;
  getItemQuantity: (id: string) => number | undefined;
  getCartQuantity: () => number;
  cartOpen: boolean;
  cartItems: CartItem[];
  removeFromCart: (id: string) => void;
  getTotalCartPrice: () => number;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProductInfo {
  _id: string;
  title: string;
  slug: Slug;
  moreFromVendor: MoreVendorItem[];
  defaultProductVariant: DefaultProdVariant;
}
interface DefaultProdVariant {
  barcode: {};
  images: {}[];
  price: number;
  _type: string;
}

interface MoreVendorItem {
  defaultProductVariant: {
    _type: string;
    images: [];
    price: number;
    taxable: boolean;
    title: string;
  };
  slug: Slug;
}

interface CartItem {
  _id: string;
  totalPrice: number;
  title: string;
  slug: Slug;
  quantity: number;
  moreFromVendor: MoreVendorItem[];
  defaultProductVariant: DefaultProdVariant;
}
interface Slug {
  _type: string;
  current: string;
}

export const ShoppingCartProvider = ({
  children,
}: ShoppingCartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  function getItemQuantity(id: string) {
    const data = cartItems.find((item) => {
      return item._id == id;
    })?.quantity;
    return data;
  }

  function getTotalCartPrice() {
    return cartItems.reduce((prev, curr) => {
      return prev + curr.totalPrice;
    }, 0);
  }

  function getCartQuantity() {
    return cartItems.length;
  }

  function removeFromCart(id: string) {
    setCartItems((currentItems) => {
      return currentItems.filter((item) => item._id !== id);
    });
  }

  function modifyItemQuantity(
    productInfo: ProductInfo,
    productQuantity: number
  ) {
    setCartItems((currentItems) => {
      if (currentItems?.find((item) => item._id === productInfo._id) == null) {
        return [
          ...currentItems,
          {
            ...productInfo,
            quantity: productQuantity,
            totalPrice:
              productInfo.defaultProductVariant.price * productQuantity,
          },
        ];
      } else {
        return currentItems.map((item) => {
          if (item._id == productInfo._id) {
            return {
              ...item,
              quantity: productQuantity,
              totalPrice:
                productInfo.defaultProductVariant.price * productQuantity,
            };
          } else {
            return item;
          }
        });
      }
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        modifyItemQuantity,
        getItemQuantity,
        getCartQuantity,
        cartOpen,
        cartItems,
        setCartOpen,
        removeFromCart,
        getTotalCartPrice,
      }}
    >
      <AnimatePresence>{cartOpen && <ShoppingCartOverlay />}</AnimatePresence>
      {children}
    </ShoppingCartContext.Provider>
  );
};
