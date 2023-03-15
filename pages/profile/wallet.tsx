import React from "react";
import WalletPage from "../../components/profilePage/walletPage/walletPage";

const Wallet = () => {
  return <WalletPage></WalletPage>;
};

export default Wallet;
export const getServerSideProps = withPageAuthRequired();
