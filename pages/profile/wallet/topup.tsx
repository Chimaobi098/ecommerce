// pages/wallet/topup.tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { supabase } from "../../../utils/supabaseClient";
import { ToastContainer, toast } from "react-toastify";

// import { X as XIcon } from 'lucide-react'

const HARDCODED_ACCOUNT_NUMBER = "1234567890";
const HARDCODED_BANK_NAME = "My Personal Bank";
const TOP_UP_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

const TopUpPage: React.FC = () => {
  const notify = () => toast("Payment successful"); //toast
  const router = useRouter();
  const { user } = useUser();

  const { amount: rawAmount } = router.query;
  const amount = typeof rawAmount === "string" ? parseInt(rawAmount, 10) : 0;

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(TOP_UP_EXPIRY_MS);

  useEffect(() => {
    const deadline = Date.now() + TOP_UP_EXPIRY_MS;
    const interval = setInterval(() => {
      const diff = deadline - Date.now();
      setTimeLeft(diff > 0 ? diff : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // const minutes = Math.floor(timeLeft / 60000);
  // const seconds = Math.floor((timeLeft % 60000) / 1000);

  // console.log('user is ', user);
  const userDataForInsert = {
    email: user?.email,
    email_verified: user?.email_verified,
    given_name: user?.given_name,
    name: user?.name,
    nickname: user?.nickname,
    sid: user?.sid,
    sub: user?.sub,
    amount: amount,
    time_of_transfer: new Date().toISOString(),
  };

  const sendUserPaymentDetails = async () => {
    const { data, error } = await supabase
      .from("transfer_data") // your table name
      .insert([userDataForInsert]);

    if (error) {
      console.error("Insert failed:", error);
    } else {
      console.log("User inserted:", data);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 🔴 Header */}
      <div className="bg-black h-16 flex items-center px-4 text-white relative">
        <button
          className="absolute left-4 text-xl"
          onClick={() => router.back()}
          aria-label="Go back"
        >
          ←
        </button>
        <h1 className="flex-1 text-center font-semibold">Top Up</h1>
        <button
          className="absolute right-4"
          onClick={() => router.back()}
          aria-label="Close"
        >
          {/* <XIcon size={20} /> */}
        </button>
      </div>

      {/* 📋 Body */}
      <div className="p-6 space-y-6">
        <p className="text-m text-gray-700 text-center">
          Transfer NGN {amount.toLocaleString()} to the account
        </p>

        <div className="border rounded-lg p-4 space-y-4">
          {/* Bank Name */}
          <div>
            <div className="text-xs font-medium uppercase text-gray-500 mt-2">
              Bank Name
            </div>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-base">{HARDCODED_BANK_NAME}</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(HARDCODED_BANK_NAME)
                }
                aria-label="Copy bank name"
              >
                📋
              </button>
            </div>
          </div>

          {/* Account Number */}
          <div>
            <div className="text-xs font-medium uppercase text-gray-500 mt-4">
              Account Number
            </div>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-base">{HARDCODED_ACCOUNT_NUMBER}</span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(HARDCODED_ACCOUNT_NUMBER)
                }
                aria-label="Copy account number"
              >
                📋
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <div className="text-xs font-medium uppercase text-gray-500 mt-4">
              Amount
            </div>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-base">NGN {amount.toLocaleString()} </span>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(HARDCODED_ACCOUNT_NUMBER)
                }
                aria-label="Copy account number"
              >
                📋
              </button>
            </div>
          </div>

          {/* Expiry */}
          <div className="text-xs text-center text-gray-500">
            <strong className="uppercase">
              please include the email associated with your account in the
              transfer description
              {/* {minutes}:{seconds.toString().padStart(2, "0")} */}
            </strong>
          </div>
        </div>

        {/* Actions */}
        <button
          className="w-full py-4 bg-black text-white rounded-md"
          onClick={() => {
            sendUserPaymentDetails();
            notify();
            setTimeout(() => {
              router.back();
            }, 2500);
          }}
        >
          I’ve sent the money
        </button>
        <ToastContainer autoClose={2500} />

        <button
          className="w-full py-4 text-red-600"
          onClick={() => router.back()}
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

export default TopUpPage;
