import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { User } from "../../interfaces/interface";
import ProfilePage from "../../components/profilePage/profilePage";
import { NavBar, Wrapper } from "../../components/Home/home.styles";

const Profile = ({ user }: User) => {
  return (
    <>
      <h1>Profile</h1>
      {!user ? (
        <button>Login</button>
      ) : (
        <Wrapper>
          <ProfilePage user={user} />
        </Wrapper>
      )}
    </>
  );
};

export default Profile;

//export const getServerSideProps = withPageAuthRequired();
