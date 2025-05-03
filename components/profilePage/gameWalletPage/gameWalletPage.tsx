import { useUser } from "@auth0/nextjs-auth0";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { TransactionHistoryWrapper, Wrapper } from "./walletPage.styles";
import { useRouter } from "next/router";
import useAppAuth, { FbUser } from "../../../utils/firebase";
import Link from "next/link";
//copy
import Button from "@mui/material/Button";
import { usePaystackPayment } from "react-paystack";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sanityClient } from "../../../lib/sanity";

const WalletPage: React.FC = () => {
  const router = useRouter();
  // const { user, error } = useUser();
  const { getUserFromLocalStorage } = useAppAuth();
  const user = getUserFromLocalStorage();
  const [userDetails, setUserDetails] = useState<FbUser | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [carddetails, setcarddetails] = useState<boolean>(false);
  const handleCard = () => {
    setcarddetails(!carddetails);
  };
  const [amount, setAmount] = useState<string>("0.00");

  //modal
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      setUserDetails(JSON.parse(user));
    }
  }, []);

  return (
    //     <Wrapper className="mt-20 mx-4">
    //       <div className="flex flex-col items-center justify-center text-2xl py-12 gap-y-2">
    //         <div className="text-3xl md:text-4xl font-medium">
    //           ₦{userDetails?.gameWalletBalance}
    //         </div>
    //         <h4 className="text-gray-500 text-sm">Available</h4>
    //       </div>

    //       {/* <TransactionHistoryWrapper>
    //         This is your transaction history
    //       </TransactionHistoryWrapper> */}
    // {/*  */}
    //     </Wrapper>

    <Wrapper className="mt-20 mx-4">
      <div className="flex flex-col items-center justify-center text-2xl py-12 gap-y-2">
        <div className="text-3xl md:text-4xl font-medium">
          ₦{userDetails?.walletBalance}
        </div>
        <h4 className="text-gray-500 text-sm">Available</h4>
      </div>

      <div
        className={`${
          carddetails
            ? "h-screen top-0 left-0 absolute w-[457px] z-10 bg-black opacity-60"
            : ""
        }`}
        onClick={handleCard}
      ></div>

      <div className="flex flex-row justify-between gap-x-4 mb-12">
        <div className="w-2/4">
          <div onClick={handleCard}>
            <button className="w-full bg-black text-white h-12 rounded-md">
              Deposit
            </button>
          </div>
        </div>
        <div className="w-2/4">
          {/* <Link href="/profile/wallet/withdraw"> */}
          <button
            className="w-full bg-white text-black h-12 border border-black rounded-md"
            onClick={() => setShowModal(true)}
          >
            Transfer
          </button>
          {/* </Link> */}
        </div>
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md text-center w-72">
              <h2 className="text-xl font-semibold mb-4">Coming Soon </h2>
              <p className="text-sm text-gray-600 mb-6">
                The transfer feature is still being built.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="bg-black text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className={` ${
          carddetails ? "translate-y-0" : "translate-y-full"
        } w-full left-0 flex flex-col text-center absolute bottom-0 z-20 bg-white rounded-t-lg gap-y-6 px-4 pb-12 transition-all duration-500 ease-in-out transform-gpu`}
      >
        <div className="flex flex-row justify-between items-end ">
          <div className="mt-8 text-2xl font-medium">Input Top Up Amount</div>
          <div>
            <CloseOutlined
              onClick={handleCard}
              className="text-2xl mb-2 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex flex-col text-left w-full">
          <form
            className=""
            onSubmit={(e) => {
              e.preventDefault();
              if (!amount) return;
              router.push({
                pathname: "wallet/topup",
                query: { amount },
              });
            }}
          >
            <input
              type="number"
              placeholder="Amount (NGN)"
              className="h-16 w-full pl-4 placeholder-gray-800 border border-gray-800 text-lg my-8"
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              min={100}
            />

            <button
              type="submit"
              className="w-full h-16 text-white bg-black rounded-md"
            >
              Top Up Now
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </Wrapper>
  );
};

export default WalletPage;
