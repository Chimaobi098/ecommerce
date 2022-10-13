import { Button } from "@mui/material";
import React from "react";
import { urlFor } from "../../lib/sanity";

import { VendorInfo, VendorNav, Wrapper } from "./vendorPage.styles";


const VendorPage = ({vendorData}) => {
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
      </Wrapper>
      
      
    </>
  );
};

export default VendorPage;
