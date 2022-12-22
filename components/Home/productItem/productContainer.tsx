import React from "react";
import { ProductInfo } from "./productContainer.styles";
import Image from "next/image";
import { ProductVariant, Slug, Vendor } from "../../../pages/index";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { urlFor, sanityClient } from "../../../lib/sanity";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import debounce from "../../../utils/debounce";

interface ProductProps {
  productProps: {
    defaultProductVariant: ProductVariant;
    slug: Slug;
    title: string;
    vendor: Vendor;
    _id: string;
  };
  userLikedProducts: { _key: string; _ref: string }[] | undefined;
}

const ProductContainer = ({
  productProps,
  userLikedProducts,
}: ProductProps) => {
  const router = useRouter();
  const [likes, setLikes] = useState({ likeCount: 5, likeState: false });
  const [userId, setUserId] = useState("");
  const { user, error } = useUser();
  console.log(userId, "its all here");
  const handleLikes: (id: string) => void = useCallback(
    debounce((productId: string) => {
      console.log("this actually ran bro so is it actually workgin? hope so");
      if (!user) {
        router.replace("/api/auth/login");
        return;
      }
      console.log(productId, "this is where it all happens");
      fetch("/api/handleLikes", {
        method: "POST",
        body: JSON.stringify({
          _id: productId,
          likeState: !likes.likeState,
          userId,
          likedProducts: {
            _type: "reference",
            _ref: productProps._id,
          },
          productItemKey: userLikedProducts?.filter(
            (product) => product._ref == productProps._id
          )[0]?._key,
        }),
      });
    }, 2000),
    [userId]
  );

  useEffect(() => {
    async function handler() {
      let likeCountData = await sanityClient.fetch(
        `*[_type == "product" && _id == $current] {
     likes

    }`,
        { current: productProps._id }
      );
      if (!user || !userLikedProducts) {
        setLikes((prev) => {
          return { ...prev, likeCount: likeCountData[0].likes };
        });

        return;
      } else {
        setLikes({
          likeCount: likeCountData[0].likes,
          likeState: userLikedProducts!
            .map((proudct) => proudct._ref)
            .includes(productProps._id),
        });

        let userId = await sanityClient.fetch(
          `
*[_type == 'users' && userId ==$auth0ID]{
  _id,
}`,
          {
            auth0ID: user?.sub,
          }
        );
        setUserId(userId[0]._id);
      }
    }
    handler();
  }, [user, userLikedProducts]);
  return (
    <ProductInfo key={productProps._id}>
      <div id="vendor-info-container">
        <Image
          placeholder="blur"
          blurDataURL="/placeholder.png"
          className="vendorImage"
          width={50}
          height={50}
          src={urlFor(productProps.vendor.logo).url()}
          alt={productProps.title}
          onClick={() => {
            router.push(`/vendor/${productProps.vendor._id}`);
          }}
        />
        <span style={{ marginLeft: "30px" }}>{productProps.vendor.title}</span>
      </div>
      <motion.div
        whileTap={{ scale: 0.9 }}
        style={{ width: "100%", height: "45vh", position: "relative" }}
      >
        <Image
          placeholder="blur"
          blurDataURL="/placeholder.png"
          layout="fill"
          objectFit="contain"
          src={urlFor(productProps.defaultProductVariant.images[0]).url()}
          alt="Product Image"
          onClick={() => {
            router.push(`/product/${productProps.slug.current}`);
          }}
        />
      </motion.div>

      <div style={{ paddingLeft: "3vw" }}>
        <div id="action-section">
          <motion.div
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              setLikes((prev) => {
                if (prev.likeState) {
                  return { likeCount: prev.likeCount - 1, likeState: false };
                }
                return { likeCount: prev.likeCount + 1, likeState: true };
              });
              handleLikes(productProps._id);
            }}
          >
            {likes.likeState ? (
              <FavoriteIcon
                fontSize="large"
                sx={{ marginRight: "10px" }}
                color="error"
              />
            ) : (
              <FavoriteBorderIcon
                fontSize="large"
                sx={{ marginRight: "10px" }}
              />
            )}
          </motion.div>
          <CommentRoundedIcon fontSize="large" />
        </div>
        <h4 style={{ marginTop: "10px" }}>{`${likes.likeCount} like${
          likes.likeCount > 1 || likes.likeCount == 0 ? "s" : ""
        }`}</h4>
      </div>
    </ProductInfo>
  );
};

export default ProductContainer;
