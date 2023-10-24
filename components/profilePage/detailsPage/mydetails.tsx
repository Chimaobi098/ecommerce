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
    })
    console.log(userdetails);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setUserdetails((prevValues) => ({ ...prevValues, [name]: value }));
    };

     
// Import any necessary libraries or modules

// Define the document ID you want to update
const documentId = 'your-document-id';

// Define the updated data you want to apply
const updatedData = {
  // Update the fields you want to change
  firstname: userdetails.firstname,
  lastname: userdetails.lastname,
  // Add more fields as needed
};

// Define the URL of your Sanity.io API
const apiUrl = 'https://ecommerceproj.sanity.studio.api.sanity.io/v1/data/mutate/production';

// Create a function to send the update request
const updateDocument = async () => {
  try {
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer your-auth-token', // Add your authentication token here
      },
      body: JSON.stringify({
        // Specify the update operation
        patch: [
          {
            // Use the document ID you want to update
            id: documentId,
            set: updatedData, // Apply the updated data
          },
        ],
      }),
    });

    if (response.ok) {
      // Document was successfully updated
      console.log('Document updated successfully');
    } else {
      // Handle errors here
      console.error('Error updating document:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

// Call the updateDocument function to send the update request
updateDocument();

   
    

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
            <h3 className='text-base font-medium text-gray-600 mb-2'>EMAIL ADDRESS</h3>
            <input type="email" name='email' className='text-base h-8 outline-none w-full' />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>DATE OF BIRTH</h3>
            <input type="date" name='dob' className='text-base h-8 outline-none' />
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
            <button type="submit" className=' h-12 bg-black text-white rounded-md w-3/4'>SAVE CHANGES</button>
        </div>
        
        </div>
  )
}

export default MyDetails;


              
                    
