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
    size: number;
    colour: string;
  };
  variantButtonState: "selected" | "not-selected";
}

const DefaultSize = ({ productInfo, variantButtonState }: ProductInfo) => {
  console.log(ProudctInfo, "This is the product info thing");
  const [currentVariant, setCurrentVariant] = useState("");
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const { modifyItemQuantity, getItemQuantity } = useShoppingCart();
  // console.log(productInfo);
  

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
    <div className="w-full mt-4 flex flex-col gap-y-4">

    <div>Select Size</div>
    <div className="sizes flex flex-row flex-wrap gap-x-2 text-sm items-center">
     <div className="each-side rounded-2xl bg-gray-300 w-1/12 flex flex-row justify-center items-center">
     {productInfo.defaultProductVariant?.size}
       </div>


   </div>

  </div>
    </>
  );
};

export default DefaultSize;
