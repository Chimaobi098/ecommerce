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
    defaultProductVariant: DefaultProdVariant;
    moreFromVendor: [];
    slug: {};
    title: string;
    vendorProductCount: number;
    _id: string;
  };
  variantButtonState: "selected" | "not-selected";
}

const DefaultProduct = ({ productInfo, variantButtonState }: ProductInfo) => {
  console.log(ProudctInfo, "This is the product info thing");
  const [currentVariant, setCurrentVariant] = useState("");
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const { modifyItemQuantity, getItemQuantity, variantfunc, variantId, deactivateDefault } = useShoppingCart();

  useEffect(() => {
    console.log(variantButtonState);
    if (variantButtonState == "selected") {
      console.log("this actually worked ");

      modifyItemQuantity(
        {
          _id: productInfo._id,
          title: productInfo.title,
          sku: productInfo.defaultProductVariant.sku,
          defaultProductVariant: productInfo.defaultProductVariant,

          isVariant: false,
        },
        itemQuantity
      );
    }
  }, [variantButtonState]);

  return (
    <>
      {/* <Image
        objectFit="cover"
        src={urlFor(productInfo.defaultProductVariant.images[0]).url()}
        alt="Product Image"
        height="100%"
        width="30%"
      />
      <div id="product-variant">{productInfo.defaultProductVariant.sku}</div>
      <div>
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
        </button> */}
      {/* </div> */}
      {/* <div className="w-full flex flex-col gap-y-4">
      <div className=" gap-y-4">
      <div className="hidden">Colour: Black</div>
      <div className="border flex flex-row gap-x-2 items-center mt-2"> */}
      <div className="w-2/12 rounded border" onClick={()=>{
        variantfunc(productInfo.defaultProductVariant.sku);
        deactivateDefault();
        console.log(variantId);
         }}>
      <Image
        objectFit="contain"
        src={urlFor(productInfo.defaultProductVariant.images[0]).url()}
        alt="Product Image"
        height="100%"
        width="100%"
      />
      </div>
      {/* <div className="w-2/12 border">
      <Image
        objectFit="contain"
        src={urlFor(productInfo?.images[0]).url()}
        alt="Product Image"
        height="100%"
        width="100%"
      />
      </div>
      <div className="w-2/12 border">
      <Image
        objectFit="contain"
        src={urlFor(productInfo?.images[0]).url()}
        alt="Product Image"
        height="100%"
        width="100%"
      />
      </div> */}
      {/* </div>
      </div>


      <div className="flex flex-col gap-y-4 hidden">

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
      {/* </div> */}
    </>
  );
};

export default DefaultProduct;
