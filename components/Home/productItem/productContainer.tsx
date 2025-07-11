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
//import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// 🚀 Fast
import Button from '@mui/material/Button';
//import BookmarkBorderRoundedIcon from "@mui/icons-material/BookmarkBorderRounded";
//import BookmarkIcon from "@mui/icons-material/Bookmark";
//import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { useSanityUIDContext } from "../../../context/sanityUserId";
import More from '../../../public/More.svg';
import Like from '../../../public/Like.svg';
import Share from '../../../public/Share.svg';
import comment from '../../../public/Comment.svg';
import Bookmark from '../../../public/Bookmark.svg';
import ReactModal from "react-modal";

interface ProductProps {
  setLoading: Function;
  productProps: {
    defaultProductVariant: ProductVariant;
    slug: Slug;
    title: string;
    vendor: Vendor;
    _id: string;
  };
  userLikedProducts: { _key: string; _ref: string }[] | undefined;
  userSavedProducts: { _key: string; _ref: string }[] | undefined;
}

const ProductContainer = ({
  setLoading,
  productProps,
  userLikedProducts,
  userSavedProducts,
}: ProductProps) => {
  const sanityUID = useSanityUIDContext();
  // const [loading, setLoading] = useState(false);
  const [feature, setFeature] = useState(true);
  const router = useRouter();
  const [likes, setLikes] = useState({ likeCount: 5, likeState: false });
  const [postSaveState, setPostSaveState] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user, error } = useUser();
  const handleLikes: (id: string) => void = useCallback(
    debounce((productId: string) => {
      if (!user) {
        router.replace("/api/auth/login");
        return;
      }
      fetch("/api/handleLikes", {
        method: "POST",
        body: JSON.stringify({
          _id: productId,
          likeState: !likes.likeState,
          userId: sanityUID,
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
    [sanityUID]
  );

  const handlePostSave: (id: string) => void = useCallback(
    debounce((productId: string) => {
      if (!user) {
        router.replace("/api/auth/login");
        return;
      }
      fetch("/api/handlePostSave", {
        method: "POST",
        body: JSON.stringify({
          productId,
          saveState: !postSaveState,
          sanityUID,
          savedProduct: {
            _type: "reference",
            _ref: productId,
          },
          productItemKey: userSavedProducts?.filter(
            (product) => product._ref == productProps._id
          )[0]?._key,
        }),
      });
    }, 2000),
    [sanityUID]
  );

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


  function showModal(e: any) {
    e.preventDefault();
    setIsModalVisible(true);
  }

  const hideModal = () => {
    setIsModalVisible(false);
  };

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
      }
    }
    handler();
  }, [user, userLikedProducts]);

  return (
    <> 
    {isModalVisible && (
      <ReactModal
        style={customStyles}
        isOpen={isModalVisible}
        onRequestClose={hideModal}
        contentLabel="This category is comming soon"
      >
        <div>
          <p>{feature ? "Feature still in development" : "Category coming soon"} </p>
          <button onClick={hideModal}>Close</button>
        </div>
      </ReactModal>
    )}
    <ProductInfo key={productProps._id} className="first:mt-[116px]">
      <div id="vendor-info-container">
        <div id="vendor-info">
          <Image
            placeholder="blur"
            blurDataURL="/placeholder.png"
            className="vendorImage"
            width={50}
            height={50}
            unoptimized={true}
            src={urlFor(productProps.vendor.logo).url()}
            alt={productProps.title}
            onClick={() => {
              router.push(`/vendor/${productProps.vendor._id}`);
            }}
          />
          <span style={{ marginLeft: "30px" }}>
            {productProps.vendor.title}
          </span>
        </div>
        <Button style={{ color: "black", paddingLeft: "50px" }}>
          <Image src={More} alt="more icon" width={0} height={0} unoptimized={true} />
        </Button>
      </div>
      <motion.div
        whileTap={{ scale: 0.9 }}
        style={{ width: "100%", height: "20rem", position: "relative", overflowY: 'hidden' }}
      >
        <Image
          placeholder="blur"
          blurDataURL="/placeholder.png"
          objectFit="cover"
          unoptimized={true}
          width={430}
          height={370}
          src={urlFor(productProps.defaultProductVariant.images[0]).url()}
          alt="Product Image"
          onClick={() => {
            setLoading(true);
            router.push(`/product/${productProps.slug.current}`);
          }}
        />
      </motion.div>

      <div style={{ paddingLeft: "3vw" }}>
        <div id="action-section">
          <div>
            <motion.button onClick={()=>{setIsModalVisible(true)}}
              // whileTap={{ scale: 0.8 }}
              // onClick={() => {
              //   setIsModalVisible(true);   
              //   setLikes((prev) => {
              //     if (prev.likeState) {
              //       return {
              //         likeCount: prev.likeCount - 1,
              //         likeState: false,
              //       };
              //     }
              //     return { likeCount: prev.likeCount + 1, likeState: true };
              //   });
              //   handleLikes(productProps._id);
              // }}
              >
              {likes.likeState ? (
                <Image src={Like}
               //   onClick={setIsModalVisible(true)}
                  alt="like icon"  
                  unoptimized={true}
                  width={0}
                  height={0}            
                />
              ) : (
                <Image
                 src={Like}
                 alt="like icon"
             //    onClick={setIsModalVisible(true)}
                 width={35}
                 height={35}
                    />
              )}
            </motion.button>
            <button>
              <Image src={comment}  width={35} height={35} alt="comment icon" 
              />
            </button>
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={  async () => {
                try {
                  await navigator.share({
                    title: "Ecommerce",
                    text: "BUY THIS NOW!!!",
                    url: `/product/${productProps.slug.current}`,
                  });
                } catch (err) {
                  alert(err);
                }
              }}

            >
              <Image src={Share} width={35} height={35}  style={{ border: "3px solid red" }} alt="share icon" />
            </motion.button>
          </div>
          <motion.button
            id="save-button"
            whileTap={{ scale: 0.8 }}
            onClick={() => {
              setIsModalVisible(true);
              setPostSaveState((prev) => {
                handlePostSave(productProps._id);
                return !prev;
              });
            }}
          >
            {postSaveState ? (
              <Image src={Bookmark} unoptimized={true} width={0} height={0} alt="bookmark icon" />
            ) : (
              <Image  src={Bookmark}  width={35} height={35} alt="bookmark icon"  
              />
            )}
          </motion.button>
        </div>
        <h4 style={{ marginTop: "10px", marginLeft: "10px" }}>{`${likes.likeCount} like${
          likes.likeCount > 1 || likes.likeCount == 0 ? "s" : ""
        }`}</h4>
      </div>
    </ProductInfo>
    </>
  );
};

export default ProductContainer;
