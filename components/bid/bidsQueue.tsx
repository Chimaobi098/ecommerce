import { useUser } from "@auth0/nextjs-auth0";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BidForm } from "./bid-form";
import { useEffect, useState, useTransition } from "react";
import useAppAuth, { BidData } from "../../utils/firebase";
import { Timestamp } from "firebase/firestore"; // Import Firestore Timestamp
import { BidSlotValue } from "./BidSlotValue";
import { SlotBidsCount } from "./SlotBidsCount";

interface Props{
  slot: number;
  setBidQueue: React.Dispatch<React.SetStateAction<{ isOpen: boolean; slot: number; }>>;
  bids: BidData[];
  setBidForm: React.Dispatch<React.SetStateAction<{ isOpen: boolean; slot: number; }>>
}
const BidsQueue = ({setBidQueue, setBidForm, slot, bids}:Props) => {
  const { user } = useUser();
  const [targetBids, setTargetBids] = useState<BidData[]>([])

  useEffect(()=>{
    const filteredArr = bids.filter((bid) => (bid.slot === slot))
    const arrangedSlotBids = [...filteredArr].sort((a,b) => b.bidAmount - a.bidAmount) // Arranged in order of magnitude
    setTargetBids(arrangedSlotBids)
  }, [bids])

    return ( 
    <div className="fixed z-40 top-0 left-0 w-full h-[calc(100dvh-60px)] bg-gray-100">
      <div className="relative text-2xl w-full flex justify-center items-center font-bold h-[60px] border-b-[1px] border-[#00000023] bg-white">
        <button className="absolute left-2 top-1/2 -translate-y-1/2" onClick={()=>{setBidQueue({isOpen: false, slot:1})}}>
          <ArrowBackRounded />
        </button>
        Bids
      </div>

          {targetBids.length > 0? (
            <motion.section initial={{opacity:0}} animate={{opacity: 1, transition: {delay: 0.2, duration: 0.2}}} className="flex flex-col w-full h-full text-sm md:text-base items-center overflow-scroll pt-5 gap-y-7">
            {targetBids.map((bid, index)=>{
              return(
                <div key={index} className="w-[95%] rounded-l-[48px] rounded-r-[5px] flex h-20 shadow-sm bg-white">
                  <div className="flex justify-center items-center h-full aspect-square rounded-full
                  outline outline-[7px] outline-gray-100 outline-offset-[-1px] border-[5px] border-gray-100 text-lg">
                    {index+1}
                  </div>
                  <div className="flex-grow h-full relative">
                    <div className="absolute top-2 w-full flex justify-between px-5">
                      <span className="flex-grow truncate">{bid.userName}</span>
                      <span className="flex-shrink-0">₦ {bid.bidAmount.toLocaleString()}</span>
                    </div>
                    {bid.userEmail===user?.email && 
                    (<button className="absolute right-5 bottom-2 bg-blue-400 text-white rounded-lg px-3 py-1"
                    onClick={()=>{setBidForm({isOpen: true, slot: slot})}}>
                      Increase bid
                    </button>)}
                  </div>
                </div>
              )
            })}
          </motion.section>

          ):(
            <motion.div initial={{opacity:0}} animate={{opacity: 1, transition: {delay: 0.2, duration: 0.2}}}
            className="w-[95%] rounded-xl border mx-auto flex flex-col items-center gap-y-4 py-7 bg-white mt-5">
              <h2 className="text-center">
                Be the first to place a bid!
              </h2>

              <button className="w-3/4 bg-blue-400 rounded-lg px-3 py-1 text-white"
              onClick={()=>{setBidForm({isOpen: true, slot: slot})}}>
                Place Bid
              </button>
            </motion.div>
          )}
            
          
    </div>
     );
}
 
export default BidsQueue;