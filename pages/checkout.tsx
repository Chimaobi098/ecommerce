import React from "react";
import { UserProfile, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { User } from "../interfaces/interface";

import CheckoutPage from "../components/Checkout/checkoutPage";

const Checkout = ({ user }: User) => {
  return <CheckoutPage user={user} />;
};

export default Checkout;

export const getServerSideProps = withPageAuthRequired();
