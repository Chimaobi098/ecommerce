import React, {useState, useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import { Switch } from '@headlessui/react'
import { sanityClient } from '../../../lib/sanity'


const Addressbook = () => {
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
                lastname, 
                country,
                phoneNumber,
                city,
                address,
                address2,
                state,
                userId
        }`,
          { curr: user?.email }
          );
          
      setaddressdetails(results);
      
        }
        getDetails();
      }, []);
  return (
    <div className='mx-4 '>
        {// @ts-ignore
        addressdetails?.map((details, i)=>(
        <div className='w-12/12 shadow-lg h-auto border border-gray-300' key={i}>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Country</h3>
            <p className='text-base'>{details.country}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>First Name</h3>
            <p className='text-base'>{details.name}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Last Name</h3>
            <p className='text-base'>{details.lastname}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Phone Number</h3>
            <p className='text-base'>{details.phoneNumber}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>State/Province</h3>
            <p className='text-base'>{details.state}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>City</h3>
            <p className='text-base'>{details.city}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Address Line 1</h3>
            <p className='text-base'>{details.address}</p>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Address Line 2</h3>
            <p className='text-base'>{details.address2}</p>
            </div>
            
            </div>))}
        <div className='flex flex-row justify-between items-center my-4 mb-6 mx-2'>
            <div className='text-lg'>Make default</div>
            <div className=''><Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? 'bg-black' : 'bg-gray-300'}
          relative inline-flex w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-7' : 'translate-x-0'}
            pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
      </Switch></div>
            
        </div>
        <div className='flex flex-row justify-center'>
            <button className=' h-12 bg-black text-white rounded-md w-3/4'>Save Address</button>
        </div>
        
        </div>
  )
}

export default Addressbook