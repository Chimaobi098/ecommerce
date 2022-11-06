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
    width: 600px;
    height: 500px;
    margin: 0;
    padding: 0;
  }

  #vendor-info-container {
    display: flex;
    align-items: center;
    font-weight: 600;
    margin-bottom: 1vh;
    padding: 0 10px;
  }

  .vendorImage {
    
    border-radius: 50%;
    
  }

  #action-section {
    display: flex;
    margin-top: 10px;
  }

  .action-button {
    margin-right: 10px;
  }
`;
