import React from "react";
import LikedProductPage from "../../components/profilePage/likedProducts/LikedProducts";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { User } from "../../interfaces/interface";
import { useEffect, useState } from "react";
import { sanityClient } from "../../lib/sanity";

const LikedProducts = ({ user }: User) => {
  const [products, setProducts] = useState([]);
  console.log(products);
  useEffect(() => {
    async function getData() {
      let likedProducts = await sanityClient.fetch(
        `*[_type == "users" && userId == $curr] {
      likedProducts[]->{
    title,defaultProductVariant
  }

    }`,
        { curr: user?.sub }
      );

      setProducts(likedProducts[0].likedProducts);
    }
    getData();
  }, []);

  return <LikedProductPage products={products} />;
};

export default LikedProducts;
export const getServerSideProps = withPageAuthRequired();
