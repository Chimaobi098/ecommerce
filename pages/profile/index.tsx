import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { User } from "../../interfaces/interface";
import ProfilePage from "../../components/profilePage/profilePage";
import { NavBar, Wrapper } from "../../components/Home/home.styles";


const Profile = ({ user }: User) => {
  return (
    <>
          <NavBar>
        <header>My Account</header>
      </NavBar>
  <Wrapper>
  <ProfilePage user={user} />
  </Wrapper>
  </>
  )
};

export default Profile;

export const getServerSideProps = withPageAuthRequired();
