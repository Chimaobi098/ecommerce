import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 0 3vw;
  padding-bottom: 20vh;

  overflow-y: scroll;

  .input-field {
    width: 100%;
  }

  .section-title {
    font-weight: 500;
    font-size: 1.5rem;
  }
`;

export const Card = styled.div`
  width: 100%;
  min-height: 15vh;
  background: white;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 2vh;

  .item-details-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  #total-container {
    margin: 1rem 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;
