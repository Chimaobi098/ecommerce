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

const DefaultImage = ({ productInfo, variantButtonState }: ProductInfo) => {
  console.log(ProudctInfo, "This is the product info thing");
  const [currentVariant, setCurrentVariant] = useState("");
  const [itemQuantity, setItemQuantity] = useState<number>(0);
  const { modifyItemQuantity, getItemQuantity, Default } = useShoppingCart();

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
      {Default && <>          
        <Image
            layout="fill"
            objectFit="cover"
            src={urlFor(productInfo.defaultProductVariant.images[0]).url()}
            alt="Product Image"
          />
          </>}

    </>
  );
};

export default DefaultImage;
