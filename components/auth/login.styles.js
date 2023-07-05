import styled from "styled-components";

export const Wrapper = styled.div`
  .tabStyle {
    font-weight: bold;
    position: relative;
    cursor: pointer;
    &::after {
      content: "";
      width: 100%;
      height: 4px;
      margin-top: 25px;
      position: absolute;
      left: 0;
      bottom: -4px;
      background-color: black;
    }
  }
`;
