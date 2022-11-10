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
  height: 8vh;
  width: 100%;

  justify-content: center;
  align-items: center;
  // margin-right: 1rem;
  // padding: 8px 0px;
  // gap: 10px;

  // border-top:0;
  border-bottom: 0.2px solid;
  // border-image: linear-gradient(45deg, purple, orange) 1;
  button {
    background-color: transparent;
    border: none;

    left: 2vmin;

    position: absolute;
  }

  span {
    font-size: 1.75rem;
    font-family: "Chakra Petch";
    font-weight: 600;
  }
`;

export const ProudctInfo = styled(motion.div)`
  display: flex;
  width: 100%;
  padding: 0.5rem 1rem;
  border: 0;
  border-bottom: 0.2px solid;
  border-image: linear-gradient(90deg, #9896f0, #fbc8d5) 1;
  // border-bottom: 0.1px solid rgba(0, 0, 0, 0.4);
  #product-info-wrapper {
    display: flex;
    flex-direction: column;
    // border: 3px solid blue;
    margin-left: 8px;
    width: 60vw;
    justify-content: space-between;
  }

  #product-info-wrapper span {
    font-family: "Chakra Petch";
    font-weight: 500;
    font-size: 16px;
  }

  #product-details-top {
    display: flex;
    gap: 8px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    // border: 3px solid red;
  }
  #product-total-cost {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 5vmin;
  }
  #product-image {
    width: 30vmin;
    height: 30vmin;
    object-fit: contain;
    // border: 3px solid gray;
    // margin-left: 16px;
  }
  #remove-product {
    background-color: transparent;
    border: none;
  }

  #shopBag-colourandsize-container {
    font-family: "Chakra Petch";
    font-weight: 600;
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 5px 8px;
    gap: 0.3rem;

    width: 20vmin;
    background: #ece9e9;
    border-radius: 30px;
  }

  .shopBag-colour-picker {
    border-radius: 50%;

    width: 16px;
    height: 16px;

    background: linear-gradient(180deg, #4c0ffa 0%, #03ff3b 100%);
    border: 0.4px solid #000000;
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
