import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  width: 100%;
  overflow-y: scroll;
  height: 100%;
  padding-right: 3vmin;
`;

export const NavBar = styled.nav`
  background-color: white;
  width: 100%;
  padding: 1rem;

  input {
    border: 1px solid #555;
    padding: 1vmin 1vmin 1vmin 7vmin;
    background: transparent url("searchIcon.svg") no-repeat 1.5vmin center;
    border-radius: 10px;
    width: 300px;

    &::placeholder {
      font-size: 1rem;
    }
  }

  #search-tags {
    padding: 5px;
    display: flex;
    font-size: 0.8rem;
    width: 100%;
    justify-content: space-between;
    .search-tag {
      padding: 5px 10px;
      border-bottom: solid black 2px;
      font-weight: 500;
      font-size: 1rem;
    }
  }

  #search-tools {
    text-align: center;
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
