import React from "react";
import { ProfileNav } from "../../../components/Home/home.styles";
import Link from "next/link";
import GameWalletPage from "../../../components/profilePage/gameWalletPage/gameWalletPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const Wallet = () => {
  return (
    <>
      <ProfileNav>
        <Link href="/profile">
          <div className="">
            <ArrowBackRoundedIcon />
          </div>
        </Link>
        <header>Auction Wallet</header>
      </ProfileNav>
      <GameWalletPage></GameWalletPage>
    </>
  );
};

export default Wallet;
export const getServerSideProps = withPageAuthRequired();
