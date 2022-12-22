import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { User } from "../../interfaces/interface";
import ProfilePage from "../../components/profilePage/profilePage";

const Profile = ({ user }: User) => {
  return <ProfilePage user={user} />;
};

export default Profile;

export const getServerSideProps = withPageAuthRequired();
