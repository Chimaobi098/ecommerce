import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  padding-top: 27vmin;
  width: 100%;
  overflow-y: scroll;
  height: 100%;
  padding-left: 3vmin;
  padding-right: 3vmin;
`;

export const NavBar = styled.nav`
  position: absolute;
  // background: linear-gradient(red, yellow);
  top: 0;
  width: 100%;
  height: 24vmin;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  input {
    background: #ffffff;
    // border-radius: 15px;
    // border: 10px solid;
    // border-image-slice: 1;
    // border-width: 1px;
    // border-image-source: linear-gradient(to left, #743ad5, #d53a9d)

    border: 1px solid;
    // border-bottom: 4px solid;
    border-image: linear-gradient(90deg, #9896f0, #fbc8d5) 20;

    padding: 2vmin 3vmin 2vmin 9vmin;
    background: transparent url("searchIcon.svg") no-repeat 2.3vmin center;
    // border-radius: 20px;
    width: 70%;

    // background: linear-gradient(#fff, #fff),
    //   linear-gradient(to right, blue, purple);
    // background-origin: padding-box, border-box;
    // background-repeat: no-repeat; /* this is important */
    // border: 4px solid transparent;
  }

  input:before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0;
    padding: 5px;
    border-radius: 15px;
    background: linear-gradient(to right, #9c20aa, #fb3570);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  #search-tags {
    padding: 5px;
    display: flex;
    font-size: 0.8rem;
    width: 100%;
    justify-content: space-between;
    .search-tag {
      background-color: #919090;
      padding: 5px 10px;
      border-radius: 20px;
      color: white;
      font-weight: 500;
      font-size: 3vmin;
    }
  }

  #search-tools {
    display: flex;
    width: 100%;
    padding-top: 5px;
    gap: 0rem;
    align-items: center;
    justify-content: center;
  }
`;
export const SearchResultItems = styled(motion.button)`
  color: black;
  background-color: white;
  border: none;
  width: 100%;
  overflow: hidden;
  height: 16vh;
  border-radius: 1rem;
  margin-bottom: 1.5vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    height: 100%;
    width: 35vw;
    object-fit: cover;
  }

  #product-info {
    padding: 1rem 0.5rem;
    width: 50vw;
    height: 100%;
    text-align: left;
    h4,
    h3 {
      margin: 0;
    }

    h4 {
      white-space: nowrap;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;
