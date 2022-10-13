import styled from "styled-components";

export const VendorNav = styled.nav`
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

export const Wrapper = styled.div`
  margin-top: 15vmin;
  padding: 1rem;
`;

export const VendorInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  #vendor-image {
    border-radius: 50%;
    width: 20vmin;
    height: 20vmin;
  }

  #vendor-info-wrapper {
    display: flex;
    justify-content: space-between;
    flex-grow: 3;
    max-width: 200px;
    h3 {
      margin: 0;
    }
  }

  .vendor-info-items {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
