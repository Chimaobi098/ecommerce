import React from "react";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0";


import CheckoutPage from "../components/Checkout/checkoutPage";

interface User {
  user: UserProfile
}

const Checkout = ({ user }:User) => {
 
  return <CheckoutPage user = {user}/>;
};

export default Checkout;

export const getServerSideProps = withPageAuthRequired();
