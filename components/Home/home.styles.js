import styled from "styled-components";

export const Wrapper = styled.div`
  overflow-y: scroll;
  height: 100%;
  background: #fff;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-top: 15vmin;
`;
export const NavBar = styled.nav`
  background: white;
  position: fixed;
  top: 0;
  height: 15vmin;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  header {
    font-weight: 600;
    font-size: 1.8rem;
  }
`;

export const ProductInfo = styled.div`
  margin-bottom: 10px;
  width: 100%;

  #productImage {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  #vendor-info-container {
    display: flex;
    align-items: center;
    font-weight: 600;
    margin-bottom: 1vh;
  }

  #vendorImage {
    width: 50px;
    height: 50px;
    margin-right: 20px;
    margin-left: 7px;
    border-radius: 50%;
    object-fit: contain;
  }

  #action-section {
    display: flex;
    margin-top: 10px;
  }

  .action-button {
    margin-right: 10px;
  }
`;
