import React, { useState } from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { supabase } from "../../../utils/supabaseClient";
import { useUser } from "@auth0/nextjs-auth0";
import { ToastContainer, toast } from "react-toastify";

import ProductInfoOverlay from "../../productInfoOverly/prodInfoOverlay";
import { useShoppingCart } from "../../../context/shoppingCart";
import { useRouter } from "next/router";

const WithdrawPage = () => {
  const notify = () => toast("Withdrawal successful"); //toast

  const router = useRouter();
  const { user } = useUser();
  const [userBank, setUserBank] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);

  const { getWallet } = useShoppingCart();
  const [balance, setBalance] = useState(getWallet());
  const handleclear = () => {
    setInputValue("");
    if (inputValue === "") {
      setShowClearButton(false);
    }
  };

  const userDataForInsert = {
    email: user?.email,
    name: user?.name,
    sid: user?.sid,
    sub: user?.sub,
    bank: userBank,
    account_number: inputValue,
    amount: withdrawAmount,
  };

  const sendUserWithdrawalDetails = async () => {
    const { data, error } = await supabase
      .from("withdrawal_data") // your table name
      .insert([userDataForInsert]);

    if (error) {
      console.error("Insert failed:", error);
    } else {
      console.log("Details sent:", data);
    }
  };

  return (
    <form
      className=" mx-4 mb-8"
      onSubmit={(e) => {
        e.preventDefault();
        //logic for sending withdrawal details to the backend
        if (isNaN(parseFloat(withdrawAmount))) {
          alert("Invalid number");
        } else if (parseFloat(withdrawAmount) < balance) {
          sendUserWithdrawalDetails();
          notify();
          setTimeout(() => {
            router.push({
              pathname: "/profile/wallet",
            });
          }, 2500);
        } else {
          alert("amount must be less can cash balance");
        }
      }}
    >
      <div className="py-8 flex flex-col gap-y-8 text-xl text-gray-800">
        <div className="h-16 w-full relative">
          <AccountBalanceOutlinedIcon className="absolute top-5 left-2" />
          {/* <ArrowForwardIosOutlinedIcon className="absolute top-5 right-4" /> */}
          <input
            type="text"
            value={userBank}
            placeholder="Bank"
            className="h-full w-full pl-12 placeholder-gray-800 border border-gray-800"
            onChange={(e) => setUserBank(e.target.value)}
            required
            minLength={3}
          />
          {/* <select className="h-full w-full pl-12 pr-4 appearance-none border border-gray-800"> */}
          {/* <option>Select a Bank</option>

          </select> */}
        </div>
        <div className="h-16 w-full relative">
          <AccountBoxOutlinedIcon className="absolute top-5 left-2" />
          {showClearButton && (
            <CancelOutlinedIcon
              className="absolute top-5 right-4"
              onClick={handleclear}
            />
          )}
          <input
            type="number"
            value={inputValue}
            placeholder="Account Number"
            className="h-full w-full pl-12 placeholder-gray-800 border border-gray-800"
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowClearButton(true)}
            required
            minLength={9}
          />
        </div>
      </div>
      <div className="text-blue-400 text-center">
        Switch Bank Account <ArrowForwardIosOutlinedIcon className="w-2 h-2" />{" "}
      </div>

      <div className="flex flex-col  gap-y-4 mt-10 text-right text-gray-400">
        <div>Balance (NGN) {balance}</div>
        <div className="text-gray-600">
          Withdrawable Balance (NGN) {balance}
        </div>
      </div>
      <div className="py-8 flex flex-col gap-y-8 text-xl text-gray-800">
        <div className="h-16 w-full relative">
          {/* <CancelOutlinedIcon className="absolute top-3 right-4" /> */}
          <input
            type="number"
            placeholder="Amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            className="h-full w-full pl-4 placeholder-gray-800 border border-gray-800"
            min={100}
            required
          />
        </div>
        <div className="h-16 w-full relative">
          <button
            type="submit"
            className="w-full h-full text-white bg-black rounded-md"
          >
            Withdraw
          </button>
          <ToastContainer autoClose={2500} />
        </div>
      </div>
      <div className="flex flex-col  gap-y-4 my-4 text-gray-400">
        <div>1. Minimum per transaction is NGN 100.00</div>
        <div>2. Withdrawal is free, no transaction fees</div>
      </div>
    </form>
  );
};

export default WithdrawPage;
