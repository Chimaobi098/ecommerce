import styled from "styled-components";

export const Wrapper = styled.footer`
  height: 8vh;
  // height: 80px;
  width: 100%;
  background: white;
  outline: 0.1px solid rgba(0, 0, 0, 0.25);
  outline-offset: 1.5px;
  // border-top: 1px solid rgb(0, 0, 0, 25%);
  position: fixed;
  bottom: 0;
  display: flex;
  // gap: 16px;
  justify-content: space-around;
  align-items: center;

  a {
    background-color: white;
    padding: 0;
    border: none;
    // margin-top: 16px;
  }

  // FOOTER STYLING FOR PRODUCT DESCRIPTION PAGE
  .invertedBtn {
    background: #ffffff;
    border: 1px solid #000000;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.14);
  }

  .normalBtn {
    background: black;
    color: white;
    border: 1px solid #fff;
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.14);
  }

  .shortBtn {
    font-family: "Chakra Petch";
    font-style: normal;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;

    width: 45vw;
    border-radius: 5px;
    // max-width: 45vw;
    // height: 41px;
  }
`;
