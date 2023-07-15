import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div)`
  width: 100%;
  height: 110vh;
  background-color: white;
  position: relative;
  overflow-y: scroll;
  padding-bottom: 10rem;
`;

export const ProductInfoSection = styled.div`
  padding: 0 3vmin;
`;

export const VendorPage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  width: 100%;
  height: 20vh;

  #vendor-title,
  #more-vendor-info {
    text-align: center;
    margin: 0;
  }
  #vendor-title {
    font-weight: 600;
    font-size: 1.4rem;
  }

  #more-vendor-info {
    font-size: 1rem;
    color: hsl(132, 6%, 75%);
  }
  img {
    border-radius: 50%;
  }
`;

export const CloseMenu = styled(motion.div)`
  background: rgb(68, 68, 68, 0.4);
  backdrop-filter: blur(5px);
  position: fixed;
  color: white;
  top: 2vmin;
  right: 2vmin;
  border-radius: 50%;
  width: 25px;
  height: 25px;
`;

export const VendorProductsWrapper = styled.div`
  width: 100%;
  padding: 1rem 1rem;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
`;

export const VendorProduct = styled(motion.div)`
  display: inline-block;
  background-color: white;
  width: 200px;
  overflow: hidden;
  height: 18rem;
  vertical-align: top;
  border-radius: 1rem;
  margin-right: 1rem;

  p {
    margin: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 200px;
  }

  h2 {
    margin-bottom: 0.5rem;
    margin-top: 0;
  }
`;

export const CartButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;

  #quantity-control-container {
    display: flex;
    width: 40%;
  }
  .quantity-change-buttons,
  #quantity {
    flex: 1 1 auto;
  }

  .quantity-change-buttons {
    border: none;
    border-radius: 12px;
  }

  #quantity {
    text-align: center;
    margin: auto 0;
    font-size: 1.4rem;
  }

  #add-to-cart {
    background-color: #000000;
    border-radius: 12px;
    border: none;
    color: white;
    width: 100%;
    height: 60px;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #add-to-cart:hover {
    background-color: white;
    color: black;
    border: 2px solid black;
  }
`;
export const ProudctVariantBackground = styled(motion.div)`
  height: 100vh;
  backdrop-filter: blur(8px);
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  #add-variants-to-cart {
    position: absolute;
    bottom: 0;
  }

  #overlay-container {
    background-color: white;
    width: 100%;
    height: 70vh;
    padding: 1rem 1.3rem 1rem 1.3rem;

    border-radius: 1rem 1rem 0rem 0rem;
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    & > p {
      font-weight: 600;
      font-size: 1.4rem;
      margin-top: 0;
    }

    #variant-container {
    }
  }
`;

export const PlayButton = styled.button`
  position: sticky;

  top: 1rem;
  left: 1rem;
  background-color: #de5d17;
  color: white;
  z-index: 99;
  font-weight: 500;
  padding: 0.3rem 1rem;
  border-radius: 0.5rem;
  border: none;
`;
