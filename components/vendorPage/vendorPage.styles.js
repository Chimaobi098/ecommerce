import { motion } from "framer-motion";
import styled from "styled-components";

export const VendorNav = styled.nav`
  background: white;

  top: 0;
  height: 10%;

  display: flex;
  align-items: center;
  justify-content: center;

  header {
    font-weight: 600;
    font-size: 1.8rem;
  }
`;

export const Wrapper = styled.div`
  padding: 1rem;
  overflow: scroll;
  height: 90%;

  #sub-nav {
    display: flex;
    list-style: none;
    padding: 0;
  }

  .sub-nav-item {
    flex: 1;
    text-align: center;
    position: relative;
    padding-top: 1rem;
    border-radius: 0.5rem;

    #underline {
      position: absolute;
      background: black;
      width: 100%;
      height: 0.2rem;
    }
  }
`;

export const VendorInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  #vendor-image {
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
  }

  #vendor-info-wrapper {
    display: flex;
    justify-content: space-between;
    flex-grow: 3;
    max-width: 50vmin;
    h3 {
      margin: 0;
    }
  }

  .vendor-info-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
  }
`;

export const ProductImageWrapper = styled(motion.div)`
  width: 100%;
  display: grid;
  margin-bottom: 100px;

  grid-template-columns: repeat(2, 1fr);

  grid-column-gap: 7px;

  #image-wrapper {
    border-radius: 5px;
    overflow: hidden;
  }
`;
