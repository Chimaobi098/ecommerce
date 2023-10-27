import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { User } from "../../interfaces/interface";
import ProfilePage from "../../components/profilePage/profilePage";
import { NavBar, Wrapper } from "../../components/Home/home.styles";
import settingIcon from "../../public/iwwa_settings.svg";
import  Image from 'next/image';


const Profile = ({ user }: User) => {
  return (
    <>
        <NavBar style={{ textAlign: "center", display: "flex", justifyContent: "center", }}>
        <header style={{ width: "100%" }}>My Account</header>
        <Image src={settingIcon} width={0} height={0} /> 
      </NavBar>
  <Wrapper>
  <ProfilePage user={user} />
  </Wrapper>
  </>
  )
};

export default Profile;

export const getServerSideProps = withPageAuthRequired();
