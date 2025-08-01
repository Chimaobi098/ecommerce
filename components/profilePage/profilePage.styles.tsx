import styled from "styled-components";

// export const ProfileItem = styled.div`
//   display: flex;
//   flex-shrink: 0;
//   justify-content: space-between;
//   align-items: center;
//   border-top: 1px solid lightgray;
//   padding: 0 10px;
//   width: 100%;
//   height: 12vh;
//   .profile-name-container {
//     display: flex;
//     div {
//       margin-left: 10px;
//     }
//   }
//   .Image {
//     color: red;
//   }
// `;

export const ProfileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 12px 16px;
  margin: 8px 0;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);

  .profile-name-container {
    display: flex;
    align-items: center;
    gap: 12px;

    .icon-wrapper {
      background-color: rgb(242, 242, 242);
      display: flex;
      padding: 12px;
      border-radius: 12px;
      max-width: 48px;
      align-items: center;
      justify-content: center;
    }

    div {
      font-weight: 500;
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

// export const Wrapper = styled.div`
//   overflow-y: scroll;
//   ::-webkit-scrollbar {
//     display: none;
//   }
//   -ms-overflow-style: none;
//   scrollbar-width: none;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding-top: 14px;
//   header {
//     display: flex;
//     justify-content: center;
//     flex-direction: column;

//     #hi,
//     #user-name {
//       font-size: 1.5rem;
//       font-weight: 450;
//     }
//     #hi {
//       margin-bottom: 20px;
//       text-align: center;
//     }
//     #user-name {
//       margin-bottom: 25px;
//     }
//   }
// `;

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
  padding-top: 14px;
  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 0 16px 20px;
    width: 90%;
    max-width: 500px;

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
    }

    #hi {
      font-size: 1.3rem;
      margin: 0;
      font-weight: 600;
    }

    #user-name {
      font-size: 1rem;
      color: grey;
      margin: 4px 0 0;
    }
  }
`;
