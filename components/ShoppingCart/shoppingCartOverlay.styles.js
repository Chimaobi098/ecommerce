import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div)`
  height: 110vh;
  width: 100%;
  background-color: white;
  position: relative;
  z-index: 101;
  overflow-y: scroll;
  padding-bottom: 100px;
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
    position: relative;
    left: 0;
  }

  span {
    font-size: 1.5rem;
  }
`;

export const ProductInfoWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  background: #eeeeee;
  height: 30vh;
`;

export const ProudctInfo = styled(motion.div)`
  display: flex;
  border-bottom: 3px solid #eeeeee;

  background-color: white;
  align-items: center;
  margin-bottom: 2vmin;
  width: 100%;
  position: absolute;
  height: 30vh;

  #product-info-wrapper {
    user-select: none;
    display: flex;
    width: 690%;
    justify-content: space-between;
    padding: 0 2vmin;
  }
  #product-details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 60%;
  }
  #product-total-cost {
    display: flex;
    align-items: center;
    font-weight: 600;
    font-size: 1.2rem;
  }
  #product-image {
    width: 30%;
    object-fit: cover;
  }
  #remove-product {
    background-color: transparent;
    border: none;
  }
`;
export const CheckoutButton = styled(motion.button)`
  position: relative;
`;
export const Deletebutton = styled(motion.button)`
  background-color: #808080;
  height: 100%;
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: -100px;
  top: 0px;
`;

export const CartItemWrapper = styled.div`
  height: 100%;
  width: 95%;
  overflow-y: scroll;
  overflow-x: hidden;
`;

export const CheckoutDetails = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  #checkout-price {
    color: grey;
    font-weight: 500;
    span {
      font-weight: 600;
      font-size: 1.2rem;
      color: #000000;
    }
  }

  #cart-item-count {
    color: grey;
    font-weight: 500;
  }

  #cart-details-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0.7rem;
  }
`;
