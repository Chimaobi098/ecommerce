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
    font-family: "Chakra Petch";
    font-weight: 600;
    font-size: 1.75rem;
  }
`;

export const ProductInfo = styled.div`
  width: 100%;
  // border-width: 0.1px 0px 0px 0px;
  // border-style: solid;
  // border-color: #000000;
  // border: 3px solid green;

  //  POST HEADER SECTION
  #vendor-info-container {
    box-sizing: border-box;
    /* Auto layout */
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 16px;
    gap: 16px;
    width: 100%;
    height: 56px;
    margin: 0;
  }

  #vendorName {
    display: flex;
    flex: 1;
    height: 21px;

    /* Category-body-text */
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
    color: #000;
  }

  #productImage {
    width: 100%;
    height: 328px;
    // border: 3px solid cyan;
  }

  #vendorImage {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  // Bottom part of Home Feed

  #bottom-feedCard {
    // border: 3px solid orange;
    // display: flex;
    // flex-direction: column;
  }

  #bottom-feedCard > * {
    margin: 0px 0 8px 0;
    // display: flex;
    // flex-direction: column;
  }

  #action-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // border: 1px solid green;
    padding: 0px 16px;
  }

  #left-action-side {
    display: flex;
    gap: 16px;
  }

  #right-action-side {
    display: flex;
  }

  .action-button {
    width: 24px;
    height: 24px;
  }

  #bottom-feedCard > h4 {
    // border: 3px solid lavender;
    padding: 0px 16px;
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    font-size: 1.05rem;
    // line-height: 21px;
  }

  #vendorName-Caption {
    height: 21px;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px 16px 16px;
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    // border: 3px solid black;
  }

  #feedCardCaption {
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 21px;
  }
`;
