import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div)`
  width: 100vw;
  height: 110vh;
  background-color: white;

  overflow-y: scroll;
  padding-bottom: 10rem;
`;

export const ProductInfoSection = styled.div`
  padding: 0 3vmin;
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
    width: 40vw;
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
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
  }

  #add-to-cart {
    background-color: #0aad0a;
    border-radius: 12px;
    border: none;
    color: white;
    width: 40vw;
    height: 60px;
    font-size: 5vmin;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #add-to-cart:hover {
    background-color: green;
  }
`;
