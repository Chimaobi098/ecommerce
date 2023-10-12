import React, {useState, useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import { Switch } from '@headlessui/react'
import { sanityClient } from '../../../lib/sanity'


const MyDetails = () => {
  const { user, error } = useUser();
    const [enabled, setEnabled] = useState(false)
    const [addressdetails, setaddressdetails] = useState<any>()
    const [userdetails, setUserdetails] = useState({
      firstname: "",
      lastname: "",
      deliveryPhoneNumber:"",
      deliveryAddress: "",
      
    })
    console.log(userdetails);
    console.log(addressdetails);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setUserdetails((prevValues) => ({ ...prevValues, [name]: value }));
    };

    const handleSaveChanges = async () => {
      if (!user) return;
  
      // Prepare the data to send to the server
      const data = {
        _id: addressdetails._id, // You should set this based on your data structure
        fullName: userdetails.firstname,
        deliveryAddress: userdetails.deliveryAddress,
        deliveryPhoneNumber: userdetails.deliveryPhoneNumber,

      };
  
      try {
        const response = await fetch('http://localhost:3000/api/updateUser', {
          method: 'POST',
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          console.log('Data saved successfully');
        } else {
          console.error('Failed to save data');
        }
      } catch (error) {
        console.error('Error while saving data', error);
      }
    };

   
    

    useEffect(() => {
        async function getDetails() {
          if (!user) return;
          const results = await sanityClient.fetch(
            `*[_type == "users" && email == $curr  ] {
                _id,
                name,
                email,
                dob,
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
        <div className='w-12/12 h-auto border-gray-300'>
            <div className=' px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>FIRST NAME</h3>
            <input type="text" name='firstname' className='text-base h-8 outline-none w-full' 
            onChange={handleChange}
            value={userdetails.firstname}
            />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>LAST NAME</h3>
            <input type="text" name='lastname' className='text-base h-8 outline-none w-full'
            onChange={handleChange}
            value={userdetails.lastname}
             />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>EMAIL ADDRESS</h3>{
              
                <input type="text" name='deliveryAddress' className='text-base h-8 outline-none w-full' 
                onChange={handleChange}
            value={userdetails.deliveryAddress}
                // value={addressdetails[0].email}
                />

}
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>DATE OF BIRTH</h3>
            <input type="text" name='deliveryPhoneNumber' className='text-base h-8 outline-none'
            onChange={handleChange}
            value={userdetails.deliveryPhoneNumber}/>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mt-8 mb-2'>GENDER</h3>
            <div className='text-base mb-8 flex flex-col gap-y-2'>
                <div className='flex gap-x-4'>
                    <input type='radio' value="Male" name="gender" id='male' />
                    <label htmlFor="male">Male</label>
                </div>
                <div className='border-t border-t-gray-300'></div>
                <div className='flex gap-x-4 '>
                    <input type='radio' value="Female" name="gender" id='female' />
                    <label htmlFor="female">Female</label>
                </div>
            </div>
            </div>
            
            </div>
            
            <div className=" flex flex-row h-12 w-full justify-evenly mt-2 mb-8 lg:mb-0 px-2 gap-x-4">
            <button type="submit" className=' h-12 bg-black text-white rounded-md w-3/4'onClick={handleSaveChanges} >SAVE CHANGES</button>
        </div>
        
        </div>
  )
}

export default MyDetails


              
                    
