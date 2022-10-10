import styled from "styled-components";

export const Wrapper = styled.nav`
  /* ORIGINAL CSS
  background: red;
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
  }  */

  // box-sizing: border-box;

  /* Auto layout */
  position: fixed;

  top: 0%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 16px;
  // gap: 10px;
  width: 100%;
  height: 8vh;
  // height: 15vmin;
  background: #fff;
  outline: 0.1px solid rgba(0, 0, 0, 0.25);
  outline-offset: 2px;
  // box-shadow: 0px 0.01px 4px rgba(0, 0, 0, 0.25);
  header {
    font-size: 1.5rem;

    /* Category-header-text */
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 600;
    font-size: 24px;
    line-height: 31px;
  }
`;
