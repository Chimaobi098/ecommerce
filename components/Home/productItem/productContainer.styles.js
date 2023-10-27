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
    justify-content: space-between;
    font-weight: 600;
    margin-bottom: 1vh;
    padding: 0 10px;

    #vendor-info {
      display: flex;
      align-items: center;
    }
  }

  .vendorImage {
    border-radius: 50%;
  }

  #action-section {
    display: flex;
    margin-top: 10px;
    gap: 0.8rem;
    justify-content: space-between;

    button {
      background-color: transparent;
      border: none;
      padding: 0;
      drop-shadow: 10px 10px 0 0 rgb(0,0,0,0.4);
      padding: 0 5px;
    }
  }
`;
