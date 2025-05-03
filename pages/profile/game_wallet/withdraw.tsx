import React from "react";
import { ProfileNav, Wrapper } from "../../../components/Home/home.styles";
import Link from "next/link";
import WithdrawPage from "../../../components/profilePage/walletPage/withdrawPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const Withdraw = () => {
  return (
    <>
      <ProfileNav>
        <Link href="/profile/wallet">
          <div className="">
            <ArrowBackRoundedIcon />
          </div>
        </Link>
        <header>With3draw</header>
      </ProfileNav>
      <Wrapper>{/* <WithdrawPage /> */}</Wrapper>
    </>
  );
};

export default Withdraw;
export const getServerSideProps = withPageAuthRequired();
