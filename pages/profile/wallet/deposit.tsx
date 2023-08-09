import React from 'react'
import { ProfileNav, Wrapper } from "../../../components/Home/home.styles";
import Link from "next/link";
import DepositPage from '../../../components/profilePage/walletPage/depositPage';
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const Deposit = () => {
  return (
    <>

<ProfileNav>
    <Link href='/profile/wallet'><div className=''><ArrowBackRoundedIcon /></div></Link>
<header>Card</header>
</ProfileNav>
  <Wrapper>
  <DepositPage />
  </Wrapper>
    </>
  )
}

export default Deposit