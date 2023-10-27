import React, { useEffect } from "react";
import Image from "next/image";
import { urlFor } from "../../lib/sanity";
import { useState } from "react";
import { ProductVariantContainer } from "./productVariant.styles";
import { formatCurrency } from "../../utils/currencyFormatter";
import { ProductInfo } from "../Home/productItem/productContainer.styles";
import {
  DefaultProdVariant,
  useShoppingCart,
} from "../../context/shoppingCart";
import { ProudctInfo } from "../ShoppingCart/shoppingCartOverlay.styles";
import { ProudctVariantBackground } from "./prodInfoOverlay.styles";

interface ProductInfo {
  productInfo: {
    images: { asset: { _ref: string; _type: string } }[];
    price: number;
    sku: string;
    title: string;
    _key: string;
    
  };
  variantButtonState: "selected" | "not-selected";
  productId: string;
}

const ProductVariant = ({
  productInfo,
  variantButtonState,
  productId,
}: ProductInfo) => {
  console.log(ProudctInfo, "This is the product info thing");
  const [currentVariant, setCurrentVariant] = useState("");
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const { modifyItemQuantity, getItemQuantity, variantfunc, activateDefault, variantId } = useShoppingCart();

  useEffect(() => {
    console.log(variantButtonState);
    if (variantButtonState == "selected" && variantId == productInfo._key ) {
      console.log("this actually worked ");

      modifyItemQuantity(
        {
          ...productInfo,
          isVariant: true,
          _id: productId,
        },
        itemQuantity + 1
      );
    }
  }, [variantButtonState]);

  return (
    <>
     {/* <div className="w-full flex flex-col gap-y-4">
      <div className=" gap-y-4">
      <div>Colour: Black</div>
      <div className="border flex flex-row gap-x-2 items-center mt-2"> */}
      <div className="w-2/12 border rounded hover:border-2 hover:border-black" onClick={()=>{
        variantfunc(productInfo._key);
        activateDefault();
        // console.log(variantId);
         }}>
      <Image
        objectFit="contain"
        src={urlFor(productInfo?.images[0]).url()}
        alt="Product Image"
        height="100%"
        width="100%"
        unoptimized={true}
      />
      </div>

      {/* </div>
      </div>

      <div className="flex flex-col gap-y-4">

        <div>Select Size</div>
        <div className="sizes flex flex-row flex-wrap gap-x-2 text-sm items-center">
          <div className="each-side rounded-2xl bg-gray-300 w-1/12 flex flex-row justify-center items-center">
            S
          </div>

          <div className="each-side rounded-2xl bg-gray-300 border w-1/12 flex flex-row justify-center items-center">
            XL
          </div>
          <div className="each-side rounded-2xl bg-gray-300 border w-1/12 flex flex-row justify-center items-center">
            XXL
          </div>
        </div>

      </div> */}
      {/* <div id="product-variant">{productInfo.title}</div> */}
      {/* <div>
        <button
          onClick={() => {
            setItemQuantity((prev) => {
              return prev + 1;
            });
          }}
        >
          +
        </button>
        <div>{itemQuantity}</div>
        <button
          onClick={() => {
            setItemQuantity((prev) => {
              if (prev == 0) {
                return prev;
              } else {
                return prev - 1;
              }
            });
          }}
        >
          -
        </button>
      </div> */}

      
    {/* </div> */}
    </>
  );
};

export default ProductVariant;
