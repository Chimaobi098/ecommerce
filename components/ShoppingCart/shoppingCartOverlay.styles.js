import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div)`
  height: 110vh;
  width: 100vw;
  background-color: white;
  position: relative;
  z-index: 99;
  overflow-y: scroll;
  padding-bottom: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  width: 100%;
  button {
    background-color: transparent;
    border: none;
  }

  span {
    font-size: 1.5rem;
  }
`;

export const ProudctInfo = styled(motion.div)`
  display: flex;
  align-items: center;
  margin-bottom: 4vmin;
  width: 100%;
  #product-info-wrapper {
    display: flex;
    margin-left: 10px;
    width: 60vw;
    justify-content: space-between;
    padding: 0 2vmin;
  }
  #product-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  #product-total-cost {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 5vmin;
  }
  #product-image {
    width: 30vmin;
    height: 30vmin;
    object-fit: contain;
  }
  #remove-product {
    background-color: transparent;
    border: none;
  }
`;

export const CheckoutButton = styled(motion.button)`
  width: 95vw;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  padding: 10px;
  background-color: #0aad0a;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 1rem;
    font-weight: 600;
  }

  #button-content-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  #checkout-price {
    color: #d97d04;
    background-color: white;
    padding: 3px;
    border-radius: 5px;
    font-weight: 600;
    font-size: 1.1rem;
  }
`;
