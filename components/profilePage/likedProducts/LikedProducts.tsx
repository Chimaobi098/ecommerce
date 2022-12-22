import React from "react";
import {
  Header,
  Wrapper,
  ProductItem,
  ProductImage,
} from "./likedProducts.styles";
import Image from "next/image";
import { urlFor } from "../../../lib/sanity";

const LikedProductPage = ({ products }) => {
  return (
    <>
      <Header>Liked Products</Header>
      <Wrapper>
        {products.map((product) => (
          <ProductItem>
            <ProductImage>
              <Image
                placeholder="blur"
                blurDataURL="/placeholder.png"
                className="vendorImage"
                layout="fill"
                src={urlFor(product.defaultProductVariant.images[0]).url()}
                alt={product.title}
              />
            </ProductImage>
            {product.title}
          </ProductItem>
        ))}
      </Wrapper>
    </>
  );
};

export default LikedProductPage;
