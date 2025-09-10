import { useEffect, useState } from "react";
import { BidData } from "../../utils/firebase";

type Props = {
 slot: number;
 bids: BidData[];
 setBidQueue: React.Dispatch<React.SetStateAction<{isOpen: boolean; slot: number;}>>
}
export const SlotBidsCount = ({slot, bids, setBidQueue}: Props) => {

    const [totalNumber, setTotalNumber] = useState<number>(0)

    useEffect(()=>{
        let tempValue = 0
        bids.forEach((item)=>{
            if(item.slot === slot){
                tempValue = tempValue + 1
            }
        })
        setTotalNumber(tempValue)
    }, [bids])

    return (
        <span className="bg-black text-white rounded-lg px-3 py-1 w-fit h-fit self-center"
        onClick={()=>{setBidQueue({isOpen: true, slot: slot})}}>
            Bids {totalNumber}
        </span>
    );
}