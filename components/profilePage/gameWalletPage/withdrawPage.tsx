import React, { useState } from "react";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ProductInfoOverlay from "../../productInfoOverly/prodInfoOverlay";
import { useShoppingCart } from "../../../context/shoppingCart";

const WithdrawPage = () => {
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

  return (
    <div className=" mx-4 mb-8">
      <div className="py-8 flex flex-col gap-y-8 text-xl text-gray-800">
        <div className="h-16 w-full relative">
          <AccountBalanceOutlinedIcon className="absolute top-5 left-2" />
          <ArrowForwardIosOutlinedIcon className="absolute top-5 right-4" />
          <select className="h-full w-full pl-12 pr-4 appearance-none border border-gray-800">
            <option>Select a Bank</option>
          </select>
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
          />
        </div>
      </div>

      <div className="flex flex-col  gap-y-4 mt-10 text-right text-gray-400">
        <div>Balance (NGN) {balance}</div>
        <div className="text-gray-600">
          Withdrawable Balance (NGN) {balance}
        </div>
      </div>
      <div className="py-8 flex flex-col gap-y-8 text-xl text-gray-800">
        <div className="h-16 w-full relative">
          {/* <CancelOutlinedIcon className='absolute top-3 right-4'/> */}
          <input
            type="number"
            placeholder="Amount"
            className="h-full w-full pl-4 placeholder-gray-800 border border-gray-800"
          />
        </div>
        <div className="h-16 w-full relative">
          <button className="w-full h-full text-white bg-black rounded-md">
            Withdr33aw
          </button>
        </div>
      </div>
      <div className="flex flex-col  gap-y-4 my-4 text-gray-400">
        <div>1. Minimum per transaction is NGN 100.00</div>
        <div>2. Withdrawal is free, no transaction fees</div>
      </div>
    </div>
  );
};

export default WithdrawPage;
