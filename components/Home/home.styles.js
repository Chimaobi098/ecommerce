import styled from "styled-components";

export const Wrapper = styled.div`
  overflow-y: scroll;
  height: 100vh;
  background: #fff;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-top: 9vh;
  padding-bottom: 20vh;
`;

export const NavBar = styled.nav`
  background: white;
  position: fixed;
  top: 0;
  height: 9vh;
  width: 100%;
  padding-right: 10px; 
  max-width: 450px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-bottom: 1px solid hsl(0, 0%, 90%);
  header {
    font-weight: 600;
    font-size: 1.8rem;
    width: 70%;
    text-align: center;
  }
`;


export const ProfileNav = styled.nav`
  background: white;
  position: fixed;
  top: 0;
  height: 9vh;
  width: 100%;
  max-width: 450px;
  display: flex;
  align-items: center;
  padding: 0px 10px 0px 10px;
  border-bottom: 1px solid hsl(0, 0%, 60%);
  header {
    width: 100%;
    font-weight: 600;
    font-size: 1.8rem;
    text-align: center;
  }
`;


