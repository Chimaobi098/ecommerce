import React from "react";
import { ProfileNav } from "../../../components/Home/home.styles";
import Link from "next/link";
import WalletPage from "../../../components/profilePage/walletPage/walletPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from 'next/router';

const Wallet = () => {
  const router = useRouter()
  return (
    <>
            <ProfileNav>
            <div onClick={()=>router.back()}><ArrowBackRoundedIcon /></div>
        <header>Cash Wallet</header>
      </ProfileNav>
  <WalletPage></WalletPage>

  </>
  )
};

export default Wallet;
export const getServerSideProps = withPageAuthRequired();
