import { AnimatePresence } from "framer-motion";
import React, { useContext, createContext, ReactNode } from "react";
import { useState } from "react";
import ShoppingCartOverlay from "../components/ShoppingCart/shoppingCartOverlay";
import { ProudctInfo } from "../components/ShoppingCart/shoppingCartOverlay.styles";

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
  handleItemClick: (itemId:string) =>void;
  removeFromCart: (id: string) => void;
  removeAllCartItems: (id: string) => void;
  increaseCart: (id: string) => void;
  decreaseCart: (id: string) => void;
  getTotalCartPrice: () => number;
  variantfunc: (id:string)=> void;
  variantId: string;
  activateDefault:()=>void;
  deactivateDefault:()=>void;
  Default:boolean;
  getWallet: () => number;
  setWallet: (number: number) => void;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ProductInfo {
  _id: string;
  title: string;
  sku: string;
  defaultProductVariant?: DefaultProdVariant;
  isVariant: boolean;
  price?: number;
  images?: { asset: { _ref: string; _type: string } }[];
}

export interface DefaultProdVariant {
  images: { asset: { _ref: string; _type: string } }[];
  price: number;
  sku: string;
  title: string;
  size: number;
  colour: string;
}

interface MoreVendorItem {
  defaultProductVariant: {
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
  sku: string;
  isVariant: boolean;
  quantity: number;
  defaultProductVariant?: DefaultProdVariant;
  swiped:boolean;
  images?: { asset: { _ref: string; _type: string } }[];
}

interface Slug {
  _type: string;
  current: string;
}

export const ShoppingCartProvider = ({
  children,
}: ShoppingCartProviderProps) => {
  const [cartItems, setCartItems] = useState([] as CartItem[]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [appWallet, setAppWallet] = useState(1400.56);
  console.log(cartItems, "its all here bro");
  function getItemQuantity(id: string) {
    const data = cartItems.find((item) => {
      return item._id == id;
    })?.quantity;
    return data;
    
  }
  
  const value = {
    getWallet: () => appWallet,
    setWallet: (newBalance: number ) => setAppWallet(newBalance),
  };

  const [variantId, setVariantId] = useState('');
  const [Default, setDefault] = useState(true);


  function variantfunc(id:string){
    setVariantId(id);
    console.log(variantId);
  }
  function activateDefault(){
    setDefault(false)
  }
  function deactivateDefault(){
    setDefault(true)
  }

  function getTotalCartPrice() {
    return cartItems.reduce((prev, curr) => {
      return prev + curr.totalPrice;
    }, 0);
  }

  function getCartQuantity() {
    return cartItems.length;
  };


  function handleItemClick(itemId:string) {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId ? { ...item, clicked: true } : { ...item, clicked: false }
      )
    );
  };

  function removeFromCart(id: string) {
    setCartItems((currentItems) => {
      return currentItems.filter((item) => item._id !== id);
    });
  }

  function removeAllCartItems(id: string){
    setCartItems((currentItems) => {
      return currentItems.filter((item) => {item._id !== id})
    })
  }

  function increaseCart(id: string) {
    setCartItems((currentItems) => {
      return currentItems.map((item) => {
        if (item._id === id) {
          return {
            ...item,
            quantity: item.quantity + 1,
            totalPrice: (item.totalPrice /item.quantity) * (item.quantity + 1)
          };
        }
        
        return item;
      });
    });
  }
  function decreaseCart(id: string) {
    setCartItems((currentItems) => {
      return currentItems.map((item) => {
        if (item._id === id && item.quantity > 1) {
          return {
            ...item,
            quantity: item.quantity - 1,
            totalPrice: (item.totalPrice /item.quantity) * (item.quantity - 1)
          };
        }
        return item;
      });
    });
  }
  

  function modifyItemQuantity(
    productInfo: ProductInfo,
    productQuantity: number
  ) {
    setCartItems((currentItems) => {
      if (
        currentItems?.find(
          (item) => item._id === productInfo._id && item.sku === productInfo.sku
        ) == null
      ) {
        return [
          ...currentItems,
          {
            ...productInfo,
            quantity: productQuantity,
            totalPrice: productInfo.isVariant
              ? productInfo.price! * productQuantity
              : productInfo.defaultProductVariant!.price * productQuantity,
              swiped: false,
          },
        ];
      } else {
        return currentItems.map((item) => {
          if (item._id == productInfo._id && item.sku === productInfo.sku) {
            return {
              ...item,
              quantity: productQuantity,
              totalPrice: productInfo.isVariant
                ? productInfo.price! * productQuantity
                : productInfo.defaultProductVariant!.price * productQuantity,
                swiped: false,
            };
          } else {
            return item;
          }
        });
      }
    });
  }

  function getWallet(){
    console.log(appWallet);
   return appWallet;    
  }

  function setWallet(number: number){
     setAppWallet(number);
     console.log(appWallet);
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
        handleItemClick,
        removeFromCart,
        removeAllCartItems,
        increaseCart,
        decreaseCart,
        getTotalCartPrice,
        variantId,
        variantfunc,
        Default,
        activateDefault,
        deactivateDefault,
         getWallet,
         setWallet,
         
      }}
    >
      <AnimatePresence>{cartOpen && <ShoppingCartOverlay />}</AnimatePresence>
      {children}
    </ShoppingCartContext.Provider>
  );
};
