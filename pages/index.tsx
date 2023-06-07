import { GetServerSideProps } from "next";
import React from "react";
import Home from "../components/Home/home";
import { sanityClient } from "../lib/sanity";

const productQuery = `*[_type == 'product'] | order(_id)[0...3]{
  defaultProductVariant,
  _id,
  title,
  slug,
  vendor->{
  title,
  logo,
  _id,

},
likes
}`;
export interface ProductVariant {
  images: {
    asset: {
      _ref: string;
      _type: string;
    };
  }[];
}
export interface Vendor {
  title: string;
  _id: string;
  logo: {
    asset: {
      _ref: string;
      _type: string;
    };
  };
}
export interface Slug {
  current: string;
  title: string;
}

export interface HomeProduct {
  results: {
    defaultProductVariant: ProductVariant;
    slug: Slug;
    title: string;
    vendor: Vendor;
    _id: string;
  }[];
}
//{ results }: HomeProduct
const HomePage = ({ results }: HomeProduct) => {
  return <Home results={results} />;
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async () => {
  const results = await sanityClient.fetch(productQuery);
  return { props: { results } };
};
