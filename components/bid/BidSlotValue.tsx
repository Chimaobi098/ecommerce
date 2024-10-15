import { useEffect, useState } from "react";
import { BidData } from "../../utils/firebase";

type Props = {
 slot: number;
 bids: BidData[]
}
export const BidSlotValue = ({slot, bids}: Props) => {

    const [totalValue, setTotalValue] = useState<number>(0)

    useEffect(()=>{
        let tempValue = 0
        bids.forEach((item)=>{
            if(item.slot === slot){
                tempValue = tempValue + item.bidAmount
            }
        })
        setTotalValue(tempValue)
    }, [bids])

    return ( 
        <span className="absolute left-5 top-2">₦ {totalValue.toLocaleString()}</span>
    );
}