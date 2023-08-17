import React, {useState} from 'react';
import PaymentIcon from '@mui/icons-material/Payment';
import { usePaystackPayment } from "react-paystack";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Image from 'next/image';


const DepositPage = () => {
  const [inputValue, setInputValue] = useState('');
  const [val, setVal] = useState("");

  const onChange = (e:any) => {
    setVal(e.target.value);
  };

  function cc_format(value:any) {
    const v = value
      .replace(/\s+/g, "")
      .replace(/[^0-9]/gi, "")
      .substr(0, 16);
    const parts = [];
  
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substr(i, 4));
    }
  
    return parts.length > 1 ? parts.join(" ") : value;
  }

  return (
    <div className=' mx-4 mb-8'>
        <div className='py-8 flex flex-col gap-y-8 text-lg text-gray-700'>
            <div className='h-16 w-full relative'>
                <PaymentIcon className='absolute top-5 left-2' />
                <input type='text' required placeholder='Card Number' value={cc_format(val)}
      onChange={onChange} className='h-full w-full pl-12 pr-4 appearance-none border border-gray-800'
                
                    
                />
            </div>

            <div className='flex flex-row gap-x-3 justify-between items-center'>
            <div className='h-16 w-6/12 relative'>
                <CalendarMonthIcon className='absolute top-5 left-2' />
                <input type='number' required placeholder='Expiry Date' className='h-full w-full pl-12 pr-4 appearance-none border border-gray-800'
                
                    
                />
            </div>
            <div className='h-16 w-6/12 relative'>
                <LockOpenIcon className='absolute top-5 left-2' />
                <input type='number' placeholder='CVV' required className='h-full w-full pl-12 pr-4 appearance-none border border-gray-800'
                
                    
                />
            </div>


            </div>
            
          
        </div>

        <div className='flex flex-col mt-10 text-right text-gray-400'>
            <div className='text-gray-600'>Balance (NGN) 1234.56</div>

        </div>
        <div className='pb-8 pt-2 flex flex-col gap-y-8 text-xl text-gray-800'>
            <div className='h-16 w-full relative'>

                {/* <CancelOutlinedIcon className='absolute top-3 right-4'/> */}
                <input type='number' placeholder='Amount (NGN)' className='h-full w-full pl-4 placeholder-gray-800 border border-gray-800 text-lg'/>
            </div>
            <div className='h-16 w-full relative'>
                <button className='w-full h-full text-white bg-black rounded-md'>Top Up Now</button>
            </div>
        </div>
        <div className='flex flex-row w-full justify-center py-4'>
          <img src='/Card type.svg' />

        </div>

        <div className='flex flex-col text-sm gap-y-4 my-4 text-gray-400'>
            <div>1. Minimum per transaction is NGN 100.00</div>
            <div>2. Maximum per transaction is  NGN 999,000</div>
            <div>3. Any card details you choose to save are encrypted. We do not store your CVV. </div>
            <div>4. If you have any deposit issues, please contact customer service.</div>

        </div>



    </div>
  )
}




export default DepositPage