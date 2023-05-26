import React from "react";
import { ProfileNav } from "../../components/Home/home.styles";
import Link from "next/link";
import WalletPage from "../../components/profilePage/walletPage/walletPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";


const Wallet = () => {
  return (
    <>
            <ProfileNav>
            <Link href='/profile'><div className=''><ArrowBackRoundedIcon /></div></Link>
        <header>Wallet</header>
      </ProfileNav>
  <WalletPage></WalletPage>

  </>
  )
};

export default Wallet;
export const getServerSideProps = withPageAuthRequired();
