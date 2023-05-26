import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { usePaystackPayment } from "react-paystack";
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

import {
  StoreCard,
  TransactionHistoryWrapper,
  Wrapper,
} from "./walletPage.styles";
import { useRouter } from "next/router";
import { sanityClient } from "../../../lib/sanity";

const WalletPage = () => {
  const router = useRouter();
  const { user, error } = useUser();
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  console.log(user);

  useEffect(() => {
    const getUID = async () => {
      const data = await sanityClient.fetch(
        `
*[_type == 'users' && userId ==$auth0ID]{
  _id,
  name,
  phoneNumber,
  address
}`,
        {
          auth0ID: user?.sub,
        }
      );

      setUserId(data[0]._id || "");
    };

    getUID();
  }, [user]);

  const config = {
    email: user?.email!,
    amount: Number(amount) * 100, // converting to kobo for paystack
    publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  };
  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    console.log(amount);
    alert("your payment was successful");
    fetch("/api/addToWallet", {
      method: "POST",
      body: JSON.stringify({
        amount: Number(amount),
        _id: userId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          alert("Could not add to the wallet. Please contact dev");
          router.push("/profile/wallet");
          return;
        }

        alert("money was successfully added. Thank you!!!");
      })
      .catch((err) => {
        console.log(err, "this didnt");
      });
  };

  const onClose = () => {
    alert("Don't leave; just try again 🥺👉👈");
  };
  return (
    <Wrapper className="mt-20 mx-4">
      {/* <StoreCard>
        <div>2000</div>
      </StoreCard> */}
      {/* <form
        onSubmit={(e) => {
          e.preventDefault();
          initializePayment(onSuccess, onClose);
        }}
      >
        <input
          type="number"
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          value={amount}
        />
        <Button type="submit">Add Money</Button>
      </form> */}
      <div className="flex flex-row items-center justify-between text-2xl py-12">
        <div className="flex flex-row items-center">
          <VisibilityOutlinedIcon />
          <h2 className="text-2xl mx-2">Total Balance:</h2>
          </div>
          <div className="font-medium">
          ₦1234.56
          </div>
           </div>

           <div className="flex flex-row justify-between gap-x-4 mb-12">
            <div className="w-2/4">
              <button className="w-full bg-black text-white h-12 rounded-md">Deposit</button>
            </div>
            <div className="w-2/4">
            <button className="w-full bg-white text-black h-12 border border-black rounded-md">Withdraw</button>

            </div>


           </div>

      <TransactionHistoryWrapper>
        This is your transaction history
      </TransactionHistoryWrapper>
    </Wrapper>
  );
};

export default WalletPage;
