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

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  header {
    display: flex;
    justify-content: center;
    flex-direction: column;
    #hi,
    #user-name {
      font-size: 2rem;
      font-weight: 500;
    }
    #hi {
      margin-top: 10px;
      text-align: center;
    }
    #user-name {
      margin-bottom: 30px;
    }
  }
`;
