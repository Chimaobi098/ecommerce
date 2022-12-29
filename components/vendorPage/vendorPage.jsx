import { Button } from "@mui/material";
import { motion } from "framer-motion";

import { useRouter } from "next/router";
import React from "react";
import { urlFor } from "../../lib/sanity";


import { ProductImageWrapper, VendorInfo, VendorNav, Wrapper } from "./vendorPage.styles";


const VendorPage = ({ vendorData }) => {
  
  const router = useRouter()
  return (
    <>
      
      <VendorNav>
        <header>{vendorData.title}</header>
      </VendorNav>
      <Wrapper>
        
          <VendorInfo>
          <img src={urlFor(vendorData.logo)} alt='vendor image'  id = 'vendor-image'/>
              <div id = 'vendor-info-wrapper'>
                  <div className="vendor-info-items">
                    <h3>200</h3>
                    <span>Items</span>
                  </div>
                  <div className="vendor-info-items">
                    <h3>200</h3>
                    <span>Following</span>
                  </div>
                  <div className="vendor-info-items">
                    <h3>200</h3>
                    <span>Likes</span>
                  </div>
          </div>
          
        </VendorInfo>
        <Button style={{ width: '100%' }}>Follow</Button>
        <div>
          <button>i</button>
          <button>m</button>
          <button>h</button>
        </div>
        <ProductImageWrapper>
          {vendorData.vendorProducts?
            vendorData.vendorProducts.map(item => (
              <motion.div className="image-wrapper" key={item._id} whileTap = {{scale: 0.9}} onClick ={() =>{router.push(`/product/${item.slug.current}`)}}>

                <img src={urlFor(item.defaultProductVariant.images[0]).width(300).height(300)}   id='product-image'/>
              </motion.div>
            ))

            : <p>No more products from this vendor</p>
          }
        </ProductImageWrapper>
      </Wrapper>
      
      
    </>
  );
};

export default VendorPage;
