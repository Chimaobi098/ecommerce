import styled from "styled-components";

export const VendorNav = styled.nav`
  background: white;

  top: 0;
  height: 10%;

  display: flex;
  align-items: center;
  justify-content: center;

  header {
    font-weight: 600;
    font-size: 1.8rem;
  }
`;

export const Wrapper = styled.div`
  padding: 1rem;
  overflow: scroll;
  height: 90%;
`;

export const VendorInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  #vendor-image {
    border-radius: 50%;
    width: 5rem;
    height: 5rem;
  }

  #vendor-info-wrapper {
    display: flex;
    justify-content: space-between;
    flex-grow: 3;
    max-width: 50vmin;
    h3 {
      margin: 0;
    }
  }

  .vendor-info-items {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1rem;
  }
`;

export const ProductImageWrapper = styled.div`
  width: 100%;
  display: grid;
  margin-bottom: 100px;

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
