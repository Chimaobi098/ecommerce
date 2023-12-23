import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  height: 100%;
  // padding-right: 3vmin;
  background: white;
`;

export const NavBar = styled.nav`
  background-color: white;
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 2vh;
  input {
    border: 1px solid #555;
    background:  url("searchIcon.svg") no-repeat 1.5vmin center;\
    border-radius: 10px;
    background-color: rgb(243 244 246);
    width: 100%;

    &::placeholder {
      font-size: 1rem;
    }
  }

  #search-tags {
    padding: 5px;
    border: 3px solid;
    display: flex;
    font-size: 0.8rem;
    width: 100%;
    justify-content: space-between;
    .search-tag {
      border: 3px solid;
      padding: 5px 10px;
      border-bottom: solid black 2px;
      font-weight: 500;
      font-size: 1rem;
    }
  }

  #search-tools {
    text-align: center;
    border: 3px solid;
  }
`;
export const SearchResultItems = styled(motion.button)`
  color: black;
  background-color: white;
  border: none;
  width: 100%;
  overflow: hidden;
  height: 20vh;
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
