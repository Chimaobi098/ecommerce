import React from "react";
import ProductInfoOverlay from "../../components/productInfoOverly/prodInfoOverlay";
import { sanityClient } from "../../lib/sanity";

const ProductDetails = ({ currentProduct }) => {
  return (
    <ProductInfoOverlay
      currentProduct={currentProduct[0]}
      key={currentProduct[0]._id}
    />
  );
};

export default ProductDetails;

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { productSlug } = params;
  console.log(params);
  const currentProduct = await sanityClient.fetch(
    `*[_type == 'product' && slug.current == $productSlug && !(_id in path('drafts.**'))] | order(_id)[0...3]{
  defaultProductVariant,
  _id,
  title,
  slug,

  'moreFromVendor':*[_type == 'product' && references(^.vendor->{_id}._id)&& ^._id != _id && !(_id in path('drafts.**'))]{
    slug,
    defaultProductVariant,
    title,

  }

}
        `,

    { productSlug }
  );
  console.log(currentProduct);
  return { props: { currentProduct } };
};
