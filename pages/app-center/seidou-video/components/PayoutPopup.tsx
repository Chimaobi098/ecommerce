import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import AuctionIcon from "../../../../public/Auction";
import CheckIcon from "../../../../public/CheckIcon";
import CancelIcon from "../../../../public/CancelIcon";

type Props = {
    popup: {isExpanded: boolean, template: ReactNode | null};
    setPopup: Dispatch<SetStateAction<{isExpanded: boolean, template: ReactNode | null}>>;
};

const PayoutPopup = ({setPopup, popup = {isExpanded: false, template: null}}: Props) => {
    const {isExpanded, template} = popup

    return ( 

        <AnimatePresence>
            {isExpanded &&
                <motion.div initial={{y: '-100%'}} animate={{y: 0, transition:{duration: 0.4}}} exit={{y: '-100%', transition:{ duration: 0.4 }}}
                className="fixed z-50 top-0 left-0 w-full bg-[#000000c5] h-fit py-4 px-3 text-white">
                    {template}
                </motion.div>
            }
        </AnimatePresence>
     );
}
 
export default PayoutPopup;