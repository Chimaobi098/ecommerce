// import styled from "styled-components";

// export const ProductInfo = styled.div`
//   margin-bottom: 10px;
//   width: 100%;

//   #productImage {
//     width: 600px;
//     height: 500px;
//     margin: 0;
//     padding: 0;
//   }

//   #vendor-info-container {
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     font-weight: 600;
//     margin-bottom: 1vh;
//     padding: 0 10px;

//     #vendor-info {
//       display: flex;
//       align-items: center;
//     }
//   }

//   .vendorImage {
//     border-radius: 50%;
//   }

//   #action-section {
//     display: flex;
//     margin-top: 10px;
//     gap: 0.1rem;
//     justify-content: space-between;

//     button {
//       background-color: transparent;
//       padding: 0;
//       drop-shadow: 10px 10px 0 0 rgb(0, 0, 0, 0.4);
//       padding: 0 5px;
//     }
//   }

//   Image {
//     border: 3px solid;
//   }
// `;

import styled from "styled-components";

export const ProductInfo = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 24px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;

  #vendor-info-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;

    #vendor-info {
      display: flex;
      align-items: center;

      span {
        font-weight: 600;
        font-size: 16px;
      }
    }
  }

  .vendorImage {
    border-radius: 50%;
    object-fit: cover;
  }

  .post-image-wrapper {
    width: 100%;
    position: relative;
    height: auto;
  }

  .post-image {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }

  #action-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;

    div {
      display: flex;
      gap: 18px;
      align-items: center;
    }

    button {
      background: none;
      border: none;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .like-count {
    font-size: 14px;
    font-weight: 500;
    padding: 4px 16px 12px;
  }
`;
