import styled from "styled-components";

export const Wrapper = styled.footer`
  height: 8vh;
  width: 100%;
  max-width: 450px;
  background: white;
  padding: 0 2rem;
  position: fixed;
  bottom: 0;
  display: flex;
  z-Index: 90;
  justify-content: space-between;
  align-items: center;
  a {
    background-color: white;
    padding: 0;
    border: none;
  }
  .icon-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    p {
      font-weight: 600;
      margin: 0;
      font-size: 0.9rem;
      @media screen and (max-width: 400px) {
        font-size: 0.7rem;
      }
    }
  }
`;
