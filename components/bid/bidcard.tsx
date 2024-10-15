"use client";
import { useState, useEffect, useTransition } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  getFirestore,
} from "firebase/firestore";
import { startOfDay, endOfDay } from "date-fns"; // Import from date-fns
import { BidForm } from "./bid-form";
import { formatCurrency } from "../../utils/currencyFormatter";
import useAppAuth from "../../utils/firebase";
import { useUser } from "@auth0/nextjs-auth0";
import { AnimatePresence } from "framer-motion";

type Props = {
  userEmail: string;
  username?: string;
};

export const BidCard = ({ userEmail }: Props) => {
  const { user } = useUser();
  const db = getFirestore();
  const { handleBidPlacements } = useAppAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [bidDetails, setBidDetails] = useState<{
    bid_amount: number;
    id: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    const bidRef = collection(db, "auctionBids");
    // Get the start and end of today
    const now = new Date();
    const startOfToday = startOfDay(now);
    const endOfToday = endOfDay(now);

    // Modify query to check for bids from the current user and created today
    const existingBidQuery = query(
      bidRef,
      where("userEmail", "==", userEmail),
      where("createdAt", ">=", startOfToday),
      where("createdAt", "<=", endOfToday)
    );

    const unsubscribe = onSnapshot(existingBidQuery, (snapshot) => {
      if (!snapshot.empty) {
        const bidData = snapshot.docs[0].data();
        const bidId = snapshot.docs[0].id;
        setBidDetails({
          bid_amount: bidData.bidAmount,
          id: bidId,
          username: bidData.userName,
        });
      } else {
        setBidDetails(null);
      }
    });

    return () => unsubscribe();
  }, [userEmail]);

  const handleCancelBid = async () => {
    if (bidDetails?.id) {
      try {
        const bidDocRef = doc(db, "auctionBids", bidDetails.id);
        await deleteDoc(bidDocRef);
        toast.success("Bid canceled successfully!", {
          position: "top-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
      } catch (error) {
        toast.error("Failed to cancel the bid");
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <BidForm
            onSubmit={handleFormSubmit}
            isPending={isPending}
            setIsOpen={setIsOpen}
          />
        )}
      </AnimatePresence>

      <ToastContainer />

      <div className="w-full max-w-md p-6 mx-auto bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg">
        <div className="flex flex-col gap-y-3">
          <div className="flex gap-x-3 items-center">
            {/* <div className="p-2 bg-gray-200 rounded-full">
              <Person className="text-gray-700 size-4" />
            </div> */}
            <section className="flex flex-col w-full">
              <div className="text-lg font-semibold">
                {bidDetails ? bidDetails.username : ""}
              </div>
              <div className="text-gray-500 text-sm w-full">
                {bidDetails ? (
                  <>Your Bid: {formatCurrency(bidDetails.bid_amount)}</>
                ) : (
                  <div className="text-center w-full">
                    <span className="font-bold text-base text-black">No bid placed</span> <br />
                    (Place bid to join the queue)
                  </div>
                )}
              </div>
            </section>
          </div>
          <div className="flex items-center justify-between">
            {bidDetails ? (
              <>
                <button onClick={() => {
                    setIsOpen(true);
                  }}
                className="px-4 py-2 text-sm text-white bg-blue-400 rounded-md">
                  Change bid
                </button>
                <button onClick={handleCancelBid} className="px-4 py-2 text-sm text-white bg-red-400 rounded-md">
                  Cancel bid
                </button>
              </>
            ) : (
                <button
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  className="px-4 py-2 text-sm text-white bg-blue-400 rounded-md w-full mt-2"
                >
                  Place bid
                </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
