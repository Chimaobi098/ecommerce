import React from "react";
import WalletPage from "../../components/profilePage/walletPage/walletPage";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const Wallet = () => {
  return <WalletPage></WalletPage>;
};

export default Wallet;
export const getServerSideProps = withPageAuthRequired();
