"use client";
import { Timestamp } from "firebase/firestore"; // Import Firestore Timestamp
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { formatCurrency } from "../../utils/currencyFormatter";
import { useUser } from "@auth0/nextjs-auth0";
import useAppAuth from "../../utils/firebase";

// Format date using date-fns
const formatDate = (createdAt: Date | Timestamp) => {
  let date: Date;

  if (createdAt instanceof Timestamp) {
    // Firestore Timestamp case
    date = createdAt.toDate();
  } else {
    // If it's already a Date
    date = createdAt;
  }

  return format(date, "PPPpp"); // Use date-fns to format the date
};

export interface BidData {
  userName: string;
  userEmail: string; // Added username field
  bidAmount: number;
  createdAt: Timestamp; // Firestore's Timestamp type
}

export const BidList = () => {
  const [bids, setBids] = useState<BidData[]>([]);
  const { user } = useUser();
  const { getAllBids } = useAppAuth();

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchBids = async () => {
      try {
        unsubscribe = await getAllBids(setBids);
      } catch (error) {
        console.error("Error fetching bids: ", error);
      }
    };

    fetchBids();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <section className="p-4 flex flex-col gap-y-5 bg-white border rounded-lg shadow-md w-full h-full">
      <h2 className="text-lg font-bold">Bid Queue</h2>

      {/* List of bids */}
      <div className="flex flex-grow flex-col gap-y-3 overflow-scroll">
        {bids.map((bid, index) => (
          <div
            key={bid.userEmail}
            className={`flex items-center p-4 rounded-lg shadow-md gap-x-5 last:mb-3
              ${
                bid.userEmail === user?.email ? "bg-green-100" : "bg-gray-100"
              }`}
          >
            <div className="font-bold text-gray-600">#{index + 1}</div>
            <div className="flex flex-col">
              <div className="text-lg font-bold">{bid.userEmail === user?.email? 'You' : bid.userName}</div>
              <div className="text-md text-gray-600 font-bold">
                {formatCurrency(bid.bidAmount)}
              </div>
              {/* <div className="text-xs text-gray-400">{bid.userId}</div> */}
              <div className="text-sm text-gray-500">
                {formatDate(bid.createdAt)} {/* Format and display the date */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
