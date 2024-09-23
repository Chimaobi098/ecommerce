import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  onSubmit: (bidAmount: number) => void;
  isPending: boolean;
  setIsOpen: (isOpen: boolean)=>void
};

export function BidForm({ onSubmit, isPending, setIsOpen }: Props) {
  const [bidAmount, setBidAmount] = useState<string>('')
  
  return (
    <motion.div initial={{backgroundColor: 'rgba(0,0,0,0)'}} animate={{backgroundColor: 'rgba(0,0,0,0.5)', transition: {duration: 0.3}}} exit={{backgroundColor: 'rgba(0,0,0,0)', transition: {duration: 0.3}}} 
    className="fixed top-0 left-0 h-[100dvh] w-screen flex justify-center items-center text-sm touch-none z-[99] bg-[#00000075]"
    onClick={()=>{setIsOpen(false)}}>
        <motion.div onClick={(e)=>{e.stopPropagation()}} 
        initial={{ y: '30%', opacity: 0 }} animate={{y: 0, opacity: 1, transition: {duration: 0.5}}} exit={{y: '30%', opacity: 0, transition: {duration: 0.5}}}
        className="w-[95%] px-5 py-7 rounded-lg bg-white flex flex-col gap-y-2">
          <h2 className="text-base font-bold">Bid Amount</h2>
          <input
            type="number"
            value={bidAmount}
            placeholder="0"
            onChange={(e)=>{setBidAmount(e.target.value)}}  
            className="p-3 focus:outline-black outline-[2px] outline-[#e8e8e8] outline rounded-md"          
          />
          <span className="text-xs">Enter the amount for your bid</span>
        
          <button disabled={isPending} onClick={()=>{onSubmit(parseInt(bidAmount || '0'))}}
          className="px-3 py-2 rounded-md bg-black mt-3 text-white">
            Submit bid
          </button>
      </motion.div>
    </motion.div>
  );
}
