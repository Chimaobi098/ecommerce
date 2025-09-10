import { useUser } from "@auth0/nextjs-auth0";
import { BidList } from "../../components/bid/bidList";
import { BidCard } from "../../components/bid/bidcard";
import { useRouter } from "next/router";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BidForm } from "../../components/bid/bid-form";
import { useEffect, useState, useTransition } from "react";
import useAppAuth, { BidData } from "../../utils/firebase";
import { Timestamp } from "firebase/firestore"; // Import Firestore Timestamp
import { BidSlotValue } from "../../components/bid/BidSlotValue";
import { SlotBidsCount } from "../../components/bid/SlotBidsCount";
import BidsQueue from "../../components/bid/bidsQueue";
//SUPABASE STUFF
import { getServerTime, getAuctions } from "../../supabase/fetchFunctions";
import Countdown from "./countdown";
import useAuth from "../../utils/supabaseClient";

const AuctionPage = () => {
  const { referralCode } = useAuth();

  //SUPABASE STUFF
  const [serverTime, setServerTime] = useState(null);
  const [auctions, setAuctions] = useState<{ end_time: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // 1) Fetch server time
      const st = await getServerTime();
      setServerTime(st);

      // 2) Fetch auctions
      const auctionsData = await getAuctions();
      console.log("auction page:", auctionsData);
      setAuctions(auctionsData);
    };

    loadData();
  }, []);

  //END

  // //referral stuff
  // const { referralCode } = useAuth();

  //end
  const { user } = useUser();
  console.log("user info is: ", user);
  const { getUserFromLocalStorage} = useAppAuth();
  const router = useRouter();
  const { handleBidPlacements, getAllBids } = useAppAuth();
  const [isPending, startTransition] = useTransition();
  const [bids, setBids] = useState<BidData[]>([]);
  const [bidForm, setBidForm] = useState({ isOpen: false, slot: 1 });
  const [bidQueue, setBidQueue] = useState({ isOpen: false, slot: 1 });
  const slots = [
    { slotNumber: 1 },
    { slotNumber: 2 },
    { slotNumber: 3 },
    { slotNumber: 4 },
    { slotNumber: 5 },
  ];

  const handleFormSubmit = async (bid_amount: number) => {
    const userDetails = JSON.parse(getUserFromLocalStorage() || '')
    const auctionBalance = userDetails.gameWalletBalance || 0

    const previousBid = bids.filter((bid)=> bid.userEmail === user?.email && bid.slot === bidForm.slot).map((bid)=> bid.bidAmount)[0]
    console.log(`previous bid: ${previousBid}`)
    await  handleBidPlacements(user!, bidForm.slot, bid_amount, auctionBalance, previousBid).then((res: any) => {
      console.log(res)
      if (res.success) {
        toast.success(res.success, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
      if (res.error) {
        toast.error(res.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    });
    
    setBidForm({ isOpen: false, slot: 1 });
  };

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchBids = () => {
      try {
        unsubscribe = getAllBids(setBids);
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

  // useEffect(()=>{

  // }, [bids])
  
  function checkIfUserHasBidInSlot(slot: number){
    let check: boolean
    check = bids.some((bid) => (bid.userEmail === user?.email && bid.slot === slot))

    return check
  }

  return (
    <>
      {/* MODAL */}
      <AnimatePresence>
        {bidForm.isOpen && (
          <BidForm
            onSubmit={handleFormSubmit}
            isPending={isPending}
            setBidForm={setBidForm}
            previousBid={bids.filter((bid)=> bid.userEmail === user?.email && bid.slot === bidForm.slot).map((bid)=> bid.bidAmount)[0]}
          />
        )}
      </AnimatePresence>

      {/* TOAST */}
      <ToastContainer />

      <div className="w-full h-[100dvh] flex items-center justify-center bg-gray-100 text-sm lg:text-base">
        {/* HEADER */}
        <div className="fixed top-0 z-20 text-2xl w-full flex justify-center items-center font-bold h-[60px] border-b-[1px] border-[#00000023] bg-white">
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2"
            onClick={() => {
              router.back();
            }}
          >
            <ArrowBackRounded />
          </button>
          Auction
        </div>
          
        {!user ? (
          // IF USER IS NOT SIGNED IN
          <div className=" text-gray-500">
            <span>
              Please{" "}
              <button
                className="px-2 py-[2px] rounded-md border border-[#d5d5d5] active:scale-110"
                onClick={() => {
                  router.push("/api/auth/login");
                }}
              >
                sign in
              </button>{" "}
              to place a bid.
            </span>
          </div>
          
        ) : (
          // SHOW THE BID SLOTS FOR AUTHENTICATED USERS
          <section className="flex flex-col h-[calc(100dvh-120px)] w-full text-sm md:text-base items-center gap-y-7 snap-mandatory snap-y overflow-scroll">
            {slots.map((slot, index) => {
              return (
                <div
                  key={index}
                  className="w-[95%] flex-shrink-0 first:mt-52 snap-start last:mb-[70vh] scroll-mt-3 scroll-mb-3 rounded-l-[48px] rounded-r-2xl flex h-20 bg-white"
                >
                  <div
                    className="flex justify-center items-center h-full aspect-square rounded-full
                   text-lg shadow-[3px_2px_0px_3px_#f3f4f6] bg-white"
                  >
                    {slot.slotNumber}
                  </div>
                  <div className="flex-grow h-full grid grid-cols-[0.85fr_1fr] px-4 py-2">
                    <BidSlotValue slot={slot.slotNumber} bids={bids} />
                    <span className="">
                      <Countdown
                        endTime={auctions?.end_time}
                        serverTime={serverTime}
                      />
                    </span>
                    <SlotBidsCount
                      slot={slot.slotNumber}
                      bids={bids}
                      setBidQueue={setBidQueue}
                    />
                    <span
                      className=" bg-blue-400 text-white rounded-lg px-3 py-1 w-fit h-fit self-center"
                      onClick={() => {
                        setBidForm({ isOpen: true, slot: slot.slotNumber });
                      }}
                    >
                      {checkIfUserHasBidInSlot(slot.slotNumber)? 'Increase bid':'Place a bid'}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* {referralCode && (
              <p>
                Share this link:{" "}
                <strong>{`${window.location.origin}/api/auth/login?ref=${referralCode}`}</strong>
              </p>
            )} */}
          </section>
        )}

        {bidQueue.isOpen && (
          <BidsQueue
            setBidQueue={setBidQueue}
            setBidForm={setBidForm}
            slot={bidQueue.slot}
            bids={bids}
          />
        )}
      </div>
    </>
  );
};

export default AuctionPage;
