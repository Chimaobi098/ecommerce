import React, { useRef } from "react";
import { useState } from "react";
import { sanityClient, urlFor } from "../../lib/sanity";
import { Wrapper,NavBar,ProductInfo} from './home.styles'
import InfiniteScroll from "react-infinite-scroll-component";
import { CircularProgress } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import { useEffect } from "react";
import Button from "@mui/material/Button";
import Badge from '@mui/material/Badge';
import { useShoppingCart } from "../../context/shoppingCart";
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';



const Home = ({ results }) => {

  const router = useRouter()
  const { getCartQuantity, cartOpen, setCartOpen } = useShoppingCart();
  const { user, loading, error } = useUser()
  const [productData, setProductData] = useState(results)
  console.log(productData)
  const [hasMore, setHasMore] = useState(true)
  const lastId = useRef(results[results.length - 1]._id)
  const [likes, setLikes] = useState({likeCount: 300, likeState: false})
  useEffect(() => {

    async function fetchData() {

      if (user) {
        const data = await fetch('/api/users/createUser', {
          method: 'POST',
          body: JSON.stringify(user),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const final = await data.json()
      }
    }
    fetchData()
  }, [user])


  function handleLikes() {
    setLikes(prev => {
      if (prev.likeState) {
  return {likeCount: prev.likeCount -1, likeState: false}
      }
      return{likeCount: prev.likeCount +1, likeState: true}

    })
  }

  async function fetchNextPage() {
    const { current } = lastId
    if (current === null) {
      setHasMore(false)
    }
    const data = await sanityClient.fetch(`*[_type == "product" && _id > $current] | order(_id) [0...3] {
     defaultProductVariant,
  _id,
  title,
  slug,
  vendor->{
  title,
  logo,_id
}
    }`, { current })
    if (data.length > 0) {
      lastId.current = data[data.length - 1]._id
      setProductData(prev => [...prev, ...data])
    } else {
      lastId.current = null // Reached the end
      setHasMore(false)
    }
  }


  return (

    <>
      
      <NavBar>
        <header>Home</header>
        <Button
          onClick={() => {
            setCartOpen(true);
          }}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            color: "grey",
          }}
        >
          <Badge
            badgeContent={getCartQuantity()}
            color="error"
            overlap="rectangular"
          >
            <LocalMallIcon fontSize="medium" style={{ color: "black" }} />
          </Badge>
        </Button>
      
</NavBar>
      <Wrapper id="parent" >
        
        <InfiniteScroll
          dataLength={productData.length}
          next={fetchNextPage}
          hasMore={hasMore}
          loader={<CircularProgress style={{ marginBottom: '50px' }} />}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          scrollableTarget='parent'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {productData.map((product) => (
            <ProductInfo key={product._id} >
              <div id = 'vendor-info-container'>
                <img id="vendorImage" src={urlFor(product.vendor.logo).url()} alt={product.title} onClick={() => { router.push(`/vendor/${product.vendor._id}`) }} />
                <span>{product.vendor.title}</span>
              </div>
              

              <motion.img  id='productImage' src={urlFor(product.defaultProductVariant.images[0])} alt="Product Image" onClick={() => {router.push(`/product/${product.slug.current}`) }} whileTap={{ scale: 0.9 }} />
              
              <div>
                <div id='action-section'>
                  <motion.div whileTap={{ scale: 0.8 }} onClick={handleLikes}>
                    {
likes.likeState ?
                        <FavoriteIcon fontSize='large' sx={{ marginRight: '10px' }} color = 'error'/>:<FavoriteBorderIcon fontSize='large' sx={{ marginRight: '10px' }} /> 
                        
                    }
                  </motion.div>
                  <CommentRoundedIcon fontSize='large'/>
                </div>
                <h4 style={{ marginTop: '10px'}}>{`${likes.likeCount} likes`}</h4>
              </div>

            </ProductInfo>

          ))}
        </InfiniteScroll>
      </Wrapper>

    </>

  )
};

export default Home;

export const getServerSideProps = async () => {
  const results = await sanityClient.fetch(productQuery);
  
  return { props: { results } };
};
