import { AnimatePresence, motion } from "framer-motion";
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import AuctionIcon from "../../../../public/Auction";

type Props = {
    popup: {isExpanded: boolean, template: ReactNode | null, singleViewTemplate?: boolean};
    setPopup: Dispatch<SetStateAction<{isExpanded: boolean, template: ReactNode | null}>>;
};

const PayoutPopup = ({setPopup, popup}: Props) => {
    const {isExpanded, template, singleViewTemplate} = popup
    const [allowInHouseToggle, setAllowInHouseToggle] = useState(true)
    const [notify, setNotify] = useState(false)

    function handleInHouseToggle(){
        if(allowInHouseToggle){
            setPopup((prev)=> ({...prev, isExpanded: !prev.isExpanded}))
            setNotify(false)
        }
    }

    useEffect(()=>{
        if(template && !isExpanded){
            setNotify(true)
        } else {
            setNotify(false)
        }

    }, [template])

    useEffect(()=>{
        if(singleViewTemplate){
            setPopup((prev)=> ({...prev, template: null}))
        }
    }, [isExpanded])

    return ( 
        <motion.div drag='y' dragMomentum={false} dragConstraints={{top: 0, bottom: window.innerHeight-280}} onDragStart={()=> setAllowInHouseToggle(false)} onDragEnd={()=> setAllowInHouseToggle(true)}
        className={`w-fit h-[80px] fixed left-0 top-[90px] flex drop-shadow-[0px_0px_3px_#ffffff30] text-sm font-bold z-[99] rounded-r-xl ${isExpanded? ' backdrop-blur-sm popup-transition':''}`}>
            <div className="h-full w-[45px] bg-white rounded-r-xl relative z-[2] flex justify-center items-center"
            onClick={()=> handleInHouseToggle()}>
                <AuctionIcon/>
                {notify && <div className="w-4 h-4 rounded-full absolute -right-1 -top-1 bg-[#f93636]">
                    <div className="w-4 h-4 rounded-full ping bg-[#f93636]"/>
                </div>}
            </div>

            <AnimatePresence>
                {isExpanded &&
                    <motion.div initial={{x: '-100%'}} animate={{x: 0, transition:{duration: 0.4}}} exit={{x: '-100%', transition:{ duration: 0.4 }}}
                    className="w-[calc(97vw-45px)] max-w-[400px] px-[10px] flex items-center text-white bg-[#000000c5] relative rounded-r-xl">
                        <div className="bg-[#000000c5] absolute right-full top-0 w-3 h-full" />
                        {template ?? 'Watch videos to earn bidding currency!'}
                    </motion.div>
                }
            </AnimatePresence>
            
        </motion.div>
     );
}
 
export default PayoutPopup;