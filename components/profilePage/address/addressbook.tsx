import React, {useState, useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import { Switch } from '@headlessui/react'
import { sanityClient } from '../../../lib/sanity'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Addressbook = () => {
  const { user, error } = useUser();
    const [enabled, setEnabled] = useState(false)
    const [addressdetails, setaddressdetails] = useState<any>()
    const [userId, setUserId] = useState<string>("");
    console.log(addressdetails);
    const [userdetails, setUserdetails] = useState({
      country: "",
      firstname: "",
      lastname: "",
      phone: "",
      state: "",
      city: "",
      address1: "",
      address2: "",
      
    })
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      setUserdetails((prevValues) => ({ ...prevValues, [name]: value }));
    };
    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedUserDetails = { ...userdetails, gender: e.target.value };
      setUserdetails(updatedUserDetails);
    };

    useEffect(() => {
      const getUID = async () => {
        const data = await sanityClient.fetch<{ _id: string }[]>(
          `
          *[_type == 'users' && email == $auth0ID]{
            _id
          }`, { auth0ID: user?.email }
        );
  
        setUserId(data[0]?._id || "");
        console.log(data)
      };
      
  
      getUID();
    }, [user]);

    const handleSaveChanges = async () => {
  
      // Prepare the data to send to the server
      const data = {
        _id: userId, // You should set this based on your data structure
        country: userdetails.country,
        firstname: userdetails.firstname,
        lastname: userdetails.lastname,
        phone: Number(userdetails.phone),
        state: userdetails.state,
        city: userdetails.city,
        address1: userdetails.address1,
        address2: userdetails.address2,



      };
  
      toast.info('Updating Address...', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        fetch("/api/updateAddress", {
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (!res.ok) {
              toast.error('Error Updating Address 😞', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            } else {
              toast.success('Address Details Updated Successfully 😉', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                });
            }
          })
          .catch((err) => {
            console.log(err, "This didn't");
          });
    };


   
    

    useEffect(() => {
        async function getDetails() {
          if (!user) return;
          const results = await sanityClient.fetch(
            `*[_type == "users" && email == $curr  ] {
                _id,
                firstname,
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
          
      setaddressdetails(results[0]);
      
        }
        getDetails();
      },[user]);
  return (
    <div className='mx-4 mb-12'>
      <form onSubmit={(e) => {
          e.preventDefault();
          handleSaveChanges();}}
          >
      
        <div className='w-12/12 shadow-lg h-auto border border-gray-300 '>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Country</h3>
            <input type="text" name='country' className='text-base h-8 outline-none w-full placeholder-gray-700' placeholder={addressdetails?.country}
            onChange={handleChange}
            value={userdetails.country}
             />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>First Name</h3>
            <input type="text" name='firstname' className='text-base h-8 outline-none w-full placeholder-gray-700' placeholder={addressdetails?.firstname}
            onChange={handleChange}
            value={userdetails.firstname}
            />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Last Name</h3>
            <input type="text" name='lastname' className='text-base h-8 outline-none w-full placeholder-gray-700' placeholder={addressdetails?.lastname} 
            onChange={handleChange}
            value={userdetails.lastname}
            />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Phone Number</h3>
            <input type="text" name='phone' className='text-base h-8 outline-none w-full placeholder-gray-700' placeholder={addressdetails?.phone}
             onChange={handleChange}
            value={userdetails.phone}
            />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>State/Province</h3>
            <input type="text" name='state' className='text-base h-8 outline-none w-full placeholder-gray-700' placeholder={addressdetails?.state}
            onChange={handleChange}
            value={userdetails.state}
             />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>City</h3>
            <input type="text" name='city' className='text-base h-8 outline-none w-full placeholder-gray-700'placeholder={addressdetails?.city}
            onChange={handleChange}
            value={userdetails.city}
             />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Address Line 1</h3>
            <input type="text" name='address1' className='text-base h-8 outline-none w-full placeholder-gray-700' placeholder={addressdetails?.address1}
            onChange={handleChange}
            value={userdetails.address1}
            />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='font-thin text-xs text-gray-700 mb-2'>Address Line 2</h3>
            <input type="text" name='address2' className='text-base h-8 outline-none w-full placeholder-gray-700' placeholder={addressdetails?.address2}
            onChange={handleChange}
            value={userdetails.address2}
            />
            </div>
            
            </div>
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
            <button type="submit" className=' h-12 bg-black text-white rounded-md w-3/4'>Save Address</button>
        </div>
        </form>
        <ToastContainer />
        </div>
  )
}

export default Addressbook