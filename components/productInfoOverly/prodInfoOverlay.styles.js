import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div)`
  font-family: "Chakra Petch";
  width: 100vw;
  height: 110vh;
  background-color: white;

  overflow-y: scroll;
  padding-bottom: 10rem;

  #productImage {
    height: 65%;
  }

  #currentProductTitle {
    margin: 0px;
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    margin-top: 8px;

    line-height: 31px;
    // border: 3px solid gold;
  }

  #currentProductPrice {
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 21px;
    // border: 3px solid gold;
  }
`;

export const CloseMenu = styled(motion.div)`
  background: rgb(68, 68, 68, 0.4);
  backdrop-filter: blur(5px);
  // position: fixed;
  color: white;
  top: 5vmin;
  left: 5vmin;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  position: absolute;
  // width: 24px;
  // height: 26.29px;
  // left: 18.86px;
  // top: 25px;
`;

export const ProductInfoSection = styled.div`
  padding: 0 3vmin;
  .individualSizes,
  .individualColours {
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 21px;
    background: #d9d9d9;
    backdrop-filter: blur(5px);
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 70px;
  }
  .individualColours {
    width: 64px;
  }

  .xlAndxxlSizes {
    width: 48px;
  }

  .xxxlSize {
    width: 64px;
  }

  #sizePickerContainer,
  #colourPickerContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0px;
    gap: 16px;
    max-width: 600px;
    height: 32px;
    // border: 4px solid maroon;
  }

  #sizePickerContainer > h4,
  #colourPickerContainer > h4 {
    font-weight: 500;
    line-height: 21px;
  }

  #overallSizeContainer {
    // border: 3px solid blue;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px;
    gap: 20px;
  }

  #overallSizeContainer > h3 {
    // border: 3px solid gold;
    margin: 0;
  }

  #overallSizeContainer > h3,
  #overallColourContainer > h3 {
    font-family: "Chakra Petch";
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 26px;
  }

  #productSizeAndColourContainer {
    display: flex;
    flex-direction: column;

    padding: 0px;
    gap: 8px;
    margin-bottom: 2rem;
  }

  // product Description Dropdowns
  #productDescriptionDropdowns {
    margin: 1rem 0;
  }

  .individual-pd-Dropdown {
    // display: flex;
    // flex-direction: row;
    // justify-content: space-between;
    // align-items: center;
    padding: 2px 0px;

    border-width: 0.2px 0px;
    border-style: solid;
    border-color: #000000;

    /* Inside auto layout */
    flex: none;
    order: 1;
    flex-grow: 0;
  }

  .individual-pd-Dropdown h3 {
    font-family: "Chakra Petch";
    // font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
  }

  // VENDOR DETAILS SECTION
  #vendorDetailsContainer > h3 {
    font-family: "Chakra Petch";
    font-weight: 500;
    line-height: 21px;
  }
  .longBtn {
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;
    max-width: 768px;
    margin: auto;

    border-radius: 5px;
  }

  .invertedBtn {
    background: #ffffff;
    border: 1px solid #000000;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.14);
  }

  .moreFromVendor {
    font-family: "Chakra Petch";
    font-weight: 500;
    font-size: 1.1rem;
    margin: 1.5rem 0 0.75rem 0;
    // border: 4px solid black;
  }
`;

export const VendorProductsWrapper = styled.div`
  width: 100%;
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
  border-radius: 0.5rem;
  margin-right: 12px;
  border: solid 0.8px black;

  #productPriceAndMoreIcon {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 2px 10px;
    gap: 40px;
  }

  h2 {
    margin-bottom: 0.5rem;
    margin-top: 0;
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
  }

  p {
    margin: 0 0.5rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 200px;
    // color: red;
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 275;
    font-size: 0.875rem;
    line-height: 16px;
  }

<<<<<<< HEAD
  img {
    width: 100%;
    height: 77%;
    // object-fit: cover;
  }
=======

>>>>>>> upsstream/main
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
