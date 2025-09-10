import { Balance } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";
import useAppAuth from "../../utils/firebase";


type Props = {
  onSubmit: (bidAmount: number) => void;
  isPending: boolean;
  previousBid?: number
  setBidForm: React.Dispatch<
    React.SetStateAction<{ isOpen: boolean; slot: number }>
  >;
};

export function BidForm({ onSubmit, isPending, setBidForm, previousBid }: Props) {
  const { getUserFromLocalStorage} = useAppAuth();
  const [bidAmount, setBidAmount] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const userDetails = JSON.parse(getUserFromLocalStorage() || '')
  const auctionBalance = userDetails.gameWalletBalance || 0

  return (
    <motion.div
      initial={{ backgroundColor: "rgba(0,0,0,0)" }}
      animate={{
        backgroundColor: "rgba(0,0,0,0.5)",
        transition: { duration: 0.3 },
      }}
      exit={{ backgroundColor: "rgba(0,0,0,0)", transition: { duration: 0.3 } }}
      className="fixed top-0 left-0 h-[100dvh] w-screen flex justify-center items-center text-sm touch-none z-[99] bg-[#00000075]"
      onClick={() => {
        setBidForm({ isOpen: false, slot: 1 });
      }}
    >
      <motion.div
        onClick={(e) => {
          e.stopPropagation();
        }}
        initial={{ y: "30%", opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
        exit={{ y: "30%", opacity: 0, transition: { duration: 0.5 } }}
        className="w-[95%] px-5 py-7 rounded-lg bg-white flex flex-col gap-y-2"
      >
        <h2 className="text-base font-bold">Bid Amount</h2>
        <input
          type="number"
          value={bidAmount}
          placeholder="0"
          onChange={(e) => {
            setBidAmount(e.target.value);
          }}
          className="p-3 focus:outline-black outline-[2px] outline-[#e8e8e8] outline rounded-md"
        />
        <span className="text-xs">Enter the amount for your bid</span>

        <button
          disabled={isPending}
          onClick={() => {
            if (parseInt(bidAmount) > auctionBalance) {
              // If bid is greater than the balance the user has in this slot,
              setShowPopup(true)
            } else {
              // Allow if user has sufficient funds
              onSubmit(parseInt(bidAmount || "0"));
            }
          }}
          className="px-3 py-2 rounded-md bg-black mt-3 text-white"
        >
          Submit bid
        </button>
        {/* Popup modal */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-80 text-center shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Not enough bidding currency in your wallet
              </h2>
              <p className="text-sm text-gray-600 mb-6">Kindly fund it</p>
              <div className="flex justify-between gap-4">
                <button
                  className="bg-black text-white px-4 py-2 rounded w-full"
                  onClick={() => {
                    router.push({
                      pathname: "/profile/game_wallet",
                    });
                  }}
                >
                  Fund Wallet
                </button>
                <button
                  className="bg-gray-300 text-black px-4 py-2 rounded w-full"
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
