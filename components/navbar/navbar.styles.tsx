import styled from "styled-components";

export const Wrapper = styled.nav`
  background: white;
  max-width: 450px;
  z-index: 101;
  border-bottom: 1px solid grey;
  position: fixed;
  top: 0;
  height: 9vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  header {
    font-weight: 600;
    font-size: 1.8rem;
  }
`;
