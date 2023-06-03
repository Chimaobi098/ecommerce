import styled from "styled-components";

export const ProfileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 10px;

  width: 100%;
  height: 10vh;
  .profile-name-container {
    display: flex;
    div {
      margin-left: 10px;
    }
  }
`;
export const NavBar = styled.nav`
  background: white;
  position: fixed;
  top: 0;
  height: 9vh;
  width: 100%;
  max-width: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid hsl(0, 0%, 60%);
  header {
    font-weight: 600;
    font-size: 1.8rem;
  }
`;


export const Wrapper = styled.div`
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;
  header {
    display: flex;
    justify-content: center;
    flex-direction: column;
    #hi,
    #user-name {
      font-size: 1.7rem;
      font-weight: 500;
    }
    #hi {
      margin-top: 10px;
      text-align: center;
    }
    #user-name {
      margin-bottom: 25px;
    }
  }
`;
