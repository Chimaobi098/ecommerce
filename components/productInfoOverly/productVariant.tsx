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
  const { modifyItemQuantity, getItemQuantity } = useShoppingCart();

  useEffect(() => {
    console.log(variantButtonState);
    if (variantButtonState == "selected") {
      console.log("this actually worked ");

      modifyItemQuantity(
        {
          ...productInfo,
          isVariant: true,
          _id: productId,
        },
        itemQuantity
      );
    }
  }, [variantButtonState]);

  return (
    <ProductVariantContainer>
      <Image
        objectFit="cover"
        src={urlFor(productInfo?.images[0]).url()}
        alt="Product Image"
        height="100%"
        width="30%"
      />
      <div id="product-variant">{productInfo.title}</div>
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
        </button>
      </div>
    </ProductVariantContainer>
  );
};

export default ProductVariant;
