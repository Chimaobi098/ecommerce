import styled from "styled-components";

export const VendorNav = styled.nav`
  background: #ffffff;
  border-bottom: 0.2px solid #000000;
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

export const Wrapper = styled.div`
  margin-top: 15vmin;
  padding: 1rem;
  background: white;

  .invertedBtn {
    background: #ffffff;
    border: 1px solid #000000;
    color: black;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.14);
  }

  .longBtn {
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    // padding: 8px;
    max-width: 768px;
    margin: auto;
    width: 100%;
    height: 37px;
    border-radius: 5px;
  }

  #vendor-nav {
    margin-top: 8px;

    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
  }

  #vendor-nav > * {
    // display: flex;
    width: 33%;
    height: 2.2rem;
    background: #ffffff;
    // border: 1px solid black;
    // border-width: 0 0.1px 0.1px 0.1px;
    // border-color: #000;
    // border-style: solid;
    border: 0;
    border-bottom: 0.1px solid #000000;
    // borde
  }
`;

export const VendorInfo = styled.div`
  // display: flex;
  // justify-content: space-between;
  // align-items: center;

  #vendor-imgandinfo-container {
    display: flex;
    justify-content: space-between;
    // gap: 5rem;
    align-items: center;
  }
  #vendor-image {
    border-radius: 50%;
    width: 25vmin;
    // margin: auto;
    height: 25vmin;
    // width: 100px;
    // height: 100px;
  }

  #vendor-info-wrapper {
    margin-right: 16px;
    // border: 5px solid green;

    // margin: auto;
    // align-items: flex-end;
    // padding: 0 20px;
    // margin: 2rem;
    // gap: 24px;
    display: flex;
    justify-content: space-between;
    flex-grow: 3;
    max-width: 51vmin;
    h3 {
      margin: 0;
      font-family: "Chakra Petch";
      font-weight: 510;
      font-size: 24px;
      line-height: 31px;
    }
    span {
      font-family: "Chakra Petch";
      font-weight: 410;
      line-height: 21px;
    }
  }

  .vendor-info-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 4vmin;
    // padding: 10px;
    // border: 3px solid gray;
  }

  #vendor-bio {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    align-items: flex-start;
    // padding: 0px;
    // gap: 8px;
    // margin-top: 8px;
    // border: 3px solid red;
    padding: 0;
    // margin: 0;
  }

  #vendor-bio .vendorTitleWebsite {
    font-family: "Chakra Petch";
    font-weight: 510;
    font-size: 20px;
    line-height: 26px;
    margin-top: 8px;
  }

  #vendor-bio > p {
    font-family: "Chakra Petch";
    font-weight: 425;
    line-height: 21px;
    margin: 8px 0;
  }

  #vendor-bio > .vendorWebsiteLink {
    color: #43a5ff;
  }
`;

export const ProductImageWrapper = styled.div`
  margin-top: 2px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 7px;
  #product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #image-wrapper {
    border-radius: 5px;
    overflow: hidden;
  }
`;
