import React, { useState } from 'react'
import { User } from '../../../interfaces/interface'

const MembershipPage = ({ user }: User) => {
    const [plans, setPlans] = useState('');
    const handleMonth = () =>{
        setPlans('Monthly')
    }
    const handlehalf = () =>{
        setPlans('6 Months')
    }
    const handleyear = () =>{
        setPlans('Yearly')
    }
    
  return (
    <div className='mt-12 flex flex-col items-center mx-4'>
        <div className='text-3xl font-medium'>Full Access</div>

        <div className='text-2xl font-normal mt-8 mx-4 text-center'>Get plus membership and access to all features</div>

        <div className='mt-12 flex flex-row items-center justify-between w-full gap-x-2'>
            <div className='w-4/12 h-40 border-2 rounded-lg flex flex-col justify-center items-center gap-y-2 shadow-lg hover:border-black hover:rounded-lg cursor-pointer' onClick={handleMonth}>
                <h1 className='text-base'>MONTHLY</h1>
                <p className='text-2xl'>₦1000</p>
            </div>
            <div className='w-4/12 h-40 border-2 rounded-lg flex flex-col justify-center items-center gap-x-2 shadow-lg hover:border-black hover:rounded-lg relative cursor-pointer' onClick={handlehalf}>
                <h1 className='absolute top-0 text-white bg-black h-8 w-full text-center rounded-t-lg flex justify-center items-center'>Save 500</h1>
                <h1 className='text-base'>6 MONTHS</h1>
                <p className='text-2xl'>₦5500</p>
            </div>
            <div className='w-4/12 h-48 border-2 rounded-lg flex flex-col justify-center items-center gap-x-2 shadow-lg hover:border-black hover:rounded-lg relative cursor-pointer' onClick={handleyear}>
                <h1 className='absolute top-0 text-white bg-black h-12 w-full text-center rounded-t-lg flex justify-center items-center'>Save 1000</h1>
                <h1 className='text-base'>YEARLY</h1>
                <p className='text-2xl'>₦11000</p>
            </div>
        </div>
        <ul className='w-full text-lg md:text-xl mt-12 list-disc px-4 tracking-wider'>
            <li>Access to members only section</li>
            <li>2 Promote+ ads per month</li>
            <li>2 auction listing per month</li>

        </ul>
        <button className='w-full bg-black text-white text-lg md:text-xl mt-12 rounded-lg py-3'>Subscribe to {plans} plan </button>




    </div>
  )
}

export default MembershipPage