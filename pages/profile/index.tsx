import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { User } from "../../interfaces/interface";
import ProfilePage from "../../components/profilePage/profilePage";
import { NavBar, Wrapper } from "../../components/Home/home.styles";
// import { NavBar } from "../../components/profilePage/profilePage.styles";
import settingIcon from "../../public/iwwa_settings.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import Settings from "../Settings";
//supabase stuff
import useAuth from "../../utils/supabaseClient";

const Profile = ({ user }: User) => {
  // const { referralCode } = useAuth();

  const router = useRouter();

  // console.log(router.basePath);

  const handleSettingPage = () => {
    router.push("/Settings");
  };

  return (
    <>
      <NavBar
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          fontSize: "1.6rem",
          padding: "1rem",
          fontWeight: 600,
        }}
      >
        <header style={{ width: "100%" }}>My Account</header>
        <Image
          src={settingIcon}
          onClick={handleSettingPage}
          width={0}
          height={0}
        />
      </NavBar>
      <Wrapper>
        <ProfilePage user={user} />
      </Wrapper>
    </>
  );
};

export default Profile;

export const getServerSideProps = withPageAuthRequired();
