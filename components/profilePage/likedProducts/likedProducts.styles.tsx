import styled from "styled-components";

export const Header = styled.header`
  width: 100%;
  height: 7vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  font-size: 1.7rem;
  font-weight: 500;
`;

export const Wrapper = styled.div`
  height: 100vh;
  overflow-y: scroll;
  width: 100%;
  padding: 20px;
  padding-bottom: 150px;
`;

export const ProductItem = styled.div`
  width: 100%;
  height: 120px;
  margin-bottom: 2vh;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
`;

export const ProductImage = styled.div`
  width: 38%;
  max-width: 120px;
  height: 100%;
  position: relative;
`;
