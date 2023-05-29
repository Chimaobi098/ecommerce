import React from 'react'
import { ProfileNav } from "../../../components/Home/home.styles";
import Link from "next/link";
import WithdrawPage from '../../../components/profilePage/walletPage/withdrawPage';
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const Withdraw = () => {
  return (
    <>
    <ProfileNav>
    <Link href='/profile/wallet'><div className=''><ArrowBackRoundedIcon /></div></Link>
<header>Withdraw</header>
</ProfileNav>
<WithdrawPage></WithdrawPage>

</>
  )
}

export default Withdraw
export const getServerSideProps = withPageAuthRequired();