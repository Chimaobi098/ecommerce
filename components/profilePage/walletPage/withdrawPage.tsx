import React from 'react'
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const WithdrawPage = () => {
  return (
    <div className='mt-20 mx-4'>
        <div className='py-8 flex flex-col gap-y-8 text-xl text-gray-800'>
            <div className='h-16 w-full relative'>
                <AccountBalanceOutlinedIcon className='absolute top-5 left-2' />
                <ArrowForwardIosOutlinedIcon className='absolute top-5 right-4'/>
                <select className='h-full w-full pl-12 pr-4 appearance-none border border-gray-800'>
                <option>Select a Bank</option>
                    
                </select>
            </div>
            <div className='h-16 w-full relative'>
                <AccountBoxOutlinedIcon className='absolute top-5 left-2'/>
                <CancelOutlinedIcon className='absolute top-5 right-4'/>
                <input type='number' placeholder='Account Number' className='h-full w-full pl-12 placeholder-gray-800 border border-gray-800'/>
            </div>
        </div>
        <div className='text-blue-400 text-center'>Switch Bank Account  <ArrowForwardIosOutlinedIcon className='w-3 h-3'/> </div>

        <div className='flex flex-col  gap-y-4 mt-10 text-right text-gray-400'>
            <div>Balance (NGN) 1234.56</div>
            <div className='text-gray-600'>Withdrawable Balance (NGN) 1234.56</div>

        </div>
        <div className='py-8 flex flex-col gap-y-8 text-xl text-gray-800'>
            <div className='h-16 w-full relative'>

                {/* <CancelOutlinedIcon className='absolute top-3 right-4'/> */}
                <input type='number' placeholder='Amount' className='h-full w-full pl-4 placeholder-gray-800 border border-gray-800'/>
            </div>
            <div className='h-16 w-full relative'>
                <button className='w-full h-full text-white bg-black rounded-md'>Withdraw</button>
            </div>
        </div>
        <div className='flex flex-col  gap-y-4 my-4 text-gray-400'>
            <div>1. Minimum per transaction is NGN 100.00</div>
            <div>2. Withdrawal is free, no transaction fees</div>

        </div>



    </div>
  )
}

export default WithdrawPage