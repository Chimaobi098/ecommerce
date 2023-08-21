import React, {useState, useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import { Switch } from '@headlessui/react'
import { sanityClient } from '../../../lib/sanity'


const MyDetails = () => {
  const { user, error } = useUser();
    const [enabled, setEnabled] = useState(false)
    const [addressdetails, setaddressdetails] = useState<any>()
    console.log(addressdetails);

     

   
    

    useEffect(() => {
        async function getDetails() {
          if (!user) return;
          const results = await sanityClient.fetch(
            `*[_type == "users" && email == $curr  ] {
                _id,
                name,
                email,
                lastname, 
                phoneNumber,
                userId
        }`,
          { curr: user?.email }
          );
          
      setaddressdetails(results);
      
        }
        getDetails();
      },[user]);
  return (
    <div className='mx-4 mb-12'>
        {// @ts-ignore
        addressdetails?.map((details, i)=>(
        <div className='w-12/12 h-auto border-b border-gray-300' key={i}>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>FIRST NAME</h3>
            <p className='text-base'>{details.name}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>LAST NAME</h3>
            <p className='text-base'>{details.lastname}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>EMAIL ADDRESS</h3>
            <p className='text-base'>{details.email}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>DATE OF BIRTH</h3>
            <p className='text-base'>{details.state}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mt-8 mb-2'>GENDER</h3>
            <p className='text-base'>{details.city}</p>
            </div>
            
            </div>))}
            
            <div className=" flex flex-row h-12 w-full justify-evenly mt-2 mb-8 lg:mb-0 px-2 gap-x-4">
            <button className=' h-12 bg-black text-white rounded-md w-3/4'>SAVE CHANGES</button>
        </div>
        
        </div>
  )
}

export default MyDetails