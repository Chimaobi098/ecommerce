import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled(motion.div)`
  width: 100%;
  background-color: white;
`;

export const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  .card{
     height: 200px;

  }
  .card img{
    width: 190px;
    height: 150px;
  }
`;

export const CategoryItem = styled(motion.button)`
  all: unset;
  border-top: 1px solid rgb(243 244 246);
  border-bottom: 1px solid rgb(229 231 235);
  padding: 1rem;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
`;

export const Filterbackground = styled(motion.div)`
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
