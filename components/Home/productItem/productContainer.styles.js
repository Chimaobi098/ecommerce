import styled from "styled-components";

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
