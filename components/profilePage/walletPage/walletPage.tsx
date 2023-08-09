import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePaystackPayment } from "react-paystack";
import { CloseOutlined } from "@mui/icons-material";
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

  const [depositList, setDepositList] = useState(false)

  const handleDeposit = () =>{
    setDepositList(!depositList)
  }

  useEffect(() => {
    const getUID = async () => {
      const data = await sanityClient.fetch(
        `
*[_type == 'users' && userId == $auth0ID]{
  _id,
  name,
  phoneNumber,
  address
}`,
    { auth0ID: user?.sub }
      );

      setUserId(data[0]?._id || "");
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
      <div className="flex flex-col items-center justify-center text-2xl py-12 gap-y-2">
        {/* <div className="flex flex-row items-center">
          <VisibilityOutlinedIcon />
          <h2 className="text-2xl mx-2">Total Balance:</h2>
          </div> */}
          <div className="text-3xl md:text-4xl font-medium">
          ₦{amount}1500
          </div>
          <h4 className="text-gray-500 text-sm">Available</h4>
           </div>

           <div className={`${depositList ? 'h-screen top-0 left-0 absolute w-[457px] z-10 bg-black opacity-60' : ''}`} onClick={handleDeposit}></div>

           <div className="flex flex-row justify-between gap-x-4 mb-12">
            <div className="w-2/4">
              <div onClick={handleDeposit}><button className="w-full bg-black text-white h-12 rounded-md">Deposit</button></div>
            </div>
            <div className="w-2/4">
            <Link href='/profile/wallet/withdraw'><button className="w-full bg-white text-black h-12 border border-black rounded-md">Withdraw</button></Link>

            </div>


           </div>

      <TransactionHistoryWrapper>
        This is your transaction history
      </TransactionHistoryWrapper>
      <div className={` ${depositList ? 'translate-y-0' : 'translate-y-full'} w-[457px] left-0 flex flex-col text-center absolute bottom-0 z-20 bg-white rounded-t-lg gap-y-6 px-4 pb-12 transition-all duration-500 ease-in-out transform-gpu`} >
          <div className="flex flex-row justify-between items-end ">
            <div className="mt-8 text-2xl font-medium">Select deposit method</div>
            <div><CloseOutlined onClick={handleDeposit} className="text-2xl mb-2 cursor-pointer"/></div>
            </div>
          <div className="flex flex-col border p-4 text-left cursor-pointer shadow-md">
            <div className="font-medium">Card</div>
            <div className="text-gray-400">Fund your account using debit/credit card</div>
            </div>

            <div className="flex flex-col border p-4 text-left cursor-pointer shadow-md">
            <div className="font-medium">Bank Transfer</div>
            <div className="text-gray-400">Fund your account using bank app</div>
            </div>

          
  
        </div>
    </Wrapper>
  );
};

export default WalletPage;
