import React, {useState, useEffect} from 'react'
import { useUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import { Switch } from '@headlessui/react'
import { sanityClient } from '../../../lib/sanity'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MyDetails = () => {
  const { user, error } = useUser();
    const [enabled, setEnabled] = useState(false)
    const [profileDetails, setProfileDetails] = useState<any>("")
      const [userId, setUserId] = useState<string>("");
    const [userdetails, setUserdetails] = useState({
      firstname: "",
      lastname: "",
      dob:"",
      gender: "",
      
    })
    console.log(profileDetails);



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

    useEffect(() => {
      async function getDetails() {
        if (!user) return;
        const results = await sanityClient.fetch(
          `*[_type == "users" && email == $curr  ] {
              _id,
              firstname,
              lastname, 
              dob,
              email,
              gender,
              userId
      }`,
        { curr: user?.email }
        );
        
        setProfileDetails(results[0]);
    
      }
      getDetails();
    },[user]);

    const handleSaveChanges = async () => {
  
      // Prepare the data to send to the server
      const data = {
        _id: userId, // You should set this based on your data structure
        firstname: userdetails.firstname,
        lastname: userdetails.lastname,
        dob: userdetails.dob,
        gender: userdetails.gender

      };
  
      toast.info('Updating Profile...', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
        fetch("/api/updateUser", {
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((res) => {
            if (!res.ok) {
              toast.error('Error Updating Profile 😞', {
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
              toast.success('Profile Updated Successfully 😉', {
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

   
    

  return (
    <>
    <div className='mx-4 mb-12'>
      <form onSubmit={(e) => {
          e.preventDefault();
          handleSaveChanges();
        }}>
        <div className='w-12/12 h-auto border-gray-300'>
            <div className=' px-2 py-3'>
              
            <h3 className='text-base font-medium text-gray-600 mb-2'>FIRST NAME</h3>
            <input type="text" name='firstname' className='text-base h-8 outline-none w-full placeholder-gray-700' placeholder={profileDetails?.firstname}  
            onChange={handleChange}
            value={userdetails.firstname}
            />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>LAST NAME</h3>
            <input type="text" name='lastname' className='text-base h-8 outline-none w-full placeholder-gray-700' placeholder={profileDetails?.lastname}
            onChange={handleChange}
            value={userdetails.lastname}
             />
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>EMAIL ADDRESS</h3>
              
                <input type="text" name='email' className='text-base h-8 outline-none w-full' disabled
                onChange={handleChange}
                value={profileDetails?.email}
            
            />

            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mb-2'>DATE OF BIRTH</h3>
            <input type="date" name='dob' className='text-base h-8 outline-none'
            onChange={handleChange}
            value={userdetails.dob}/>
            </div>
            <div className='border-t border-t-gray-300 px-2 py-3'>
            <h3 className='text-base font-medium text-gray-600 mt-8 mb-2'>GENDER</h3>
            <div className='text-base mb-8 flex flex-col gap-y-2'>
                <div className='flex gap-x-4'>
                    <input type='radio' value="Male" name="gender" id='male' 
                              checked={userdetails.gender === 'Male'}
                              onChange={handleRadioChange}
                              />
                    <label htmlFor="male">Male</label>
                </div>
                <div className='border-t border-t-gray-300'></div>
                <div className='flex gap-x-4 '>
                    <input type='radio' value="Female" name="gender" id='female'
                    checked={userdetails.gender === 'Female'}
                    onChange={handleRadioChange}
                     />
                    <label htmlFor="female">Female</label>
                </div>
            </div>
            </div>
            
            </div>
            
            <div className=" mt-8 w-12/12">
            <button type="submit" className='h-12 bg-black text-white rounded-md w-full '>UPDATE DETAILS</button>
        </div>
        </form>
        <ToastContainer />
        </div>
        </>
  )
}

export default MyDetails;


              
                    
