import React, { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import { Switch } from "@headlessui/react";
import { sanityClient } from "../../../lib/sanity";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAppAuth, { FbUser } from "../../../utils/firebase";

const Addressbook = () => {
  // const { user, error } = useUser();
  const [enabled, setEnabled] = useState(false);
  const [addressdetails, setaddressdetails] = useState<any>("");
  const [userId, setUserId] = useState<string>("");
  console.log(addressdetails);

  const [country, setCountry] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { getUserFromLocalStorage, updateFieldsInFirebase } = useAppAuth();

  const user = getUserFromLocalStorage();

  useEffect(() => {
    if (user) {
      setaddressdetails(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    setCountry(addressdetails.country);
    setFirstname(addressdetails.firstName);
    setLastname(addressdetails.lastName);
    setPhoneNumber(addressdetails.phone);
    setState(addressdetails.state);
    setCity(addressdetails.city);
    setAddress1(addressdetails.address1);
    setAddress2(addressdetails.address2);
  }, [addressdetails]);

  const [userdetails, setUserdetails] = useState({
    country: "",
    firstname: "",
    lastname: "",
    phone: "",
    state: "",
    city: "",
    address1: "",
    address2: "",
  });
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserdetails((prevValues) => ({ ...prevValues, [name]: value }));
  };
  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedUserDetails = { ...userdetails, gender: e.target.value };
    setUserdetails(updatedUserDetails);
  };

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

    toast.info("Updating Address...", {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

    await updateFieldsInFirebase(addressdetails.email, {
      country: country,
      firstName: firstname,
      lastName: lastname,
      phone: phoneNumber,
      state: state,
      city: city,
      address1: address1,
      address2: address2,
    });

    fetch("/api/updateAddress", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (!res.ok) {
          toast.error("Error Updating Address 😞", {
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
          toast.success("Address Details Updated Successfully 😉", {
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
    <div className="mx-4 mb-12 text-base ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveChanges();
        }}
      >
        <div className="w-12/12 h-auto text-base ">
          <div className="px-2 py-3">
            <h3 className="font-thin text-gray-700 mb-2">Country</h3>
            <input
              type="text"
              name="country"
              className="text-base h-8 outline-none w-full placeholder-gray-700"
              onChange={(e) => {
                setCountry(e.target.value);
              }}
              value={country}
              required
            />
          </div>
          <div className="border-t border-t-gray-300 px-2 py-3">
            <h3 className="font-thin text-gray-700 mb-2 t">First Name</h3>
            <input
              type="text"
              name="firstname"
              className="text-base h-8 outline-none w-full placeholder-gray-700"
              onChange={(e) => {
                setFirstname(e.target.value);
              }}
              value={firstname}
              required
            />
          </div>
          <div className="border-t border-t-gray-300 px-2 py-3">
            <h3 className="font-thin text-gray-700 mb-2">Last Name</h3>
            <input
              type="text"
              name="lastname"
              className="text-base h-8 outline-none w-full placeholder-gray-700"
              onChange={(e) => {
                setLastname(e.target.value);
              }}
              value={lastname}
              required
            />
          </div>
          <div className="border-t border-t-gray-300 px-2 py-3">
            <h3 className="font-thin text-gray-700 mb-2">Phone Number</h3>
            <input
              type="number"
              name="phone"
              className="text-base h-8 outline-none w-full placeholder-gray-700"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
              value={phoneNumber}
              required
            />
          </div>
          <div className="border-t border-t-gray-300 px-2 py-3">
            <h3 className="font-thin text-gray-700 mb-2">State/Province</h3>
            <input
              type="text"
              name="state"
              className="text-base h-8 outline-none w-full placeholder-gray-700"
              onChange={(e) => {
                setState(e.target.value);
              }}
              value={state}
              required
            />
          </div>
          <div className="border-t border-t-gray-300 px-2 py-3">
            <h3 className="font-thin text-gray-700 mb-2">City</h3>
            <input
              type="text"
              name="city"
              className="text-base h-8 outline-none w-full placeholder-gray-700"
              onChange={(e) => {
                setCity(e.target.value);
              }}
              value={city}
              required
            />
          </div>
          <div className="border-t border-t-gray-300 px-2 py-3">
            <h3 className="font-thin text-gray-700 mb-2">Address Line 1</h3>
            <input
              type="text"
              name="address1"
              className="text-base h-8 outline-none w-full placeholder-gray-700"
              onChange={(e) => {
                setAddress1(e.target.value);
              }}
              value={address1}
              required
            />
          </div>
          <div className="border-t border-t-gray-300 px-2 py-3">
            <h3 className="font-thin text-gray-700 mb-2">Address Line 2</h3>
            <input
              type="text"
              name="address2"
              className="text-base h-8 outline-none w-full placeholder-gray-700"
              onChange={(e) => {
                setAddress2(e.target.value);
              }}
              value={address2}
            />
          </div>
        </div>
        
        <div className="mt-8 w-12/12">
          <button
            type="submit"
            className=" h-12 bg-black text-white rounded-md w-full "
          >
            UPDATE ADDRESS
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Addressbook;
