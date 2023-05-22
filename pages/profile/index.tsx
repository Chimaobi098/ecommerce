import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { User } from "../../interfaces/interface";
import ProfilePage from "../../components/profilePage/profilePage";
import { NavBar } from "../../components/Home/home.styles";


const Profile = ({ user }: User) => {
  return (
    <>
          <NavBar>
        <header>My Account</header>
      </NavBar>
  
  <ProfilePage user={user} />
  </>
  )
};

export default Profile;

export const getServerSideProps = withPageAuthRequired();
