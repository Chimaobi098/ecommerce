// 🚀 Fast
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import React, { useEffect } from "react";
import { useShoppingCart } from "../context/shoppingCart";
import { WrapperCard, CardStyle } from "../components/Checkout/checkoutPage.styles";
import { formatCurrency } from "../utils/currencyFormatter";
import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/router";
import { usePaystackPayment } from "react-paystack";
import { sanityClient } from "../lib/sanity";
import { v4 as uuidv4 } from "uuid";
import { User } from "../interfaces/interface";
import { Email } from "@mui/icons-material";
import { useShippingData } from '../context/shippingContext';
import Less from '../public/less-than-symbol.png';


interface OrderInfo {
  title: string;
  currentUID: string;
  totalPrice: number;
  isDelivered: boolean;
}

interface ShippingAddressInfo{
    email: string;
    PhoneNumber: number;
    fullName: string;
    streetName: string;
    Unit: number;
    city: string;
    Postal: number;
    state: string;
    country: string;
}

const ShippingPage = ({ user }: User) => {
  const onSuccess = () => {
    alert("your payment was successful");
    fetch("/api/handleOrders", {
      method: "POST",
      body: JSON.stringify({
        title: fullName,
        user: {
          _type: "reference",
          _ref: currentUID,
        },
        totalPrice: getTotalCartPrice(),
        isDelivered: false,
        orderItems: cartItems.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          productItem: {
            _type: "reference",
            _ref: item._id,
          },
          _key: uuidv4(),
        })),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          alert("Could not place order. Please contact dev");
          router.push("/");
          return;
        }

        alert("Order was successfully placed. Thank you!!!");
      })
      .catch((err) => {
        console.log(err, "this didnt");
      });
  };

  const onClose = () => {
    alert("Don't leave; just try again 🥺👉👈");
  };

  const { shippingData, setShippingData } = useShippingData();  
  const router = useRouter();
  const [currentUID, setCurrentUID] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const { getTotalCartPrice, cartItems } = useShoppingCart();
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState<number>(0);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [PhoneNumber, setPhoneNumber] = useState<number>(0);
  const [StreetAddress, setStreetAddress] = useState<string>("");
  const [Unit, setUnit] = useState<number>(0);
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [Postal, setPostal] = useState<number>(0);
  const [state, setState] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const shippingFees = 2920;
  const totalAmount =
    getTotalCartPrice() -
    (getTotalCartPrice() * (couponDiscount / 100) || 1) +
    shippingFees;

  const config = {
    amount: totalAmount * 100, // converting to kobo for paystack
    publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
    email: ""
  }
  const initializePayment = usePaystackPayment(config);

  async function handleSubmit(e: any) {
    e.preventDefault();

     setShippingData({
      email,
      PhoneNumber, 
      fullName,
      StreetAddress,
      Unit,
      city,
      Postal,
      state,
      country
     })


    fetch("/api/updateUser", {
      method: "POST",
      body: JSON.stringify({
        _id: currentUID,
        email,
        fullName,
        PhoneNumber,
        StreetAddress,
        Unit,
        Postal,
        state,
        country
      }),
    })
      .then((res) => {
        if (!res.ok) {
          alert("Could not upload form data, try again later!");
          return;
        }
        alert("Form submitted successfully");
        router.back();
      })
      .catch((err) => {
        console.log(err, "this didnt");
      });
  }


//   useEffect(() => {
//     const getUID = async () => {
//       const data = await sanityClient.fetch(
//         `
// *[_type == 'users' && userId ==$auth0ID]{
//   _id,
//   name,
//   phoneNumber,
//   address
// }`,
//         {
//           auth0ID: user.sub,
//         }
//       );

//       setCurrentUID(data[0]._id || "");
//       setFullName(data[0].name || "");
//       setDeliveryAddress(data[0].address || "");
//       setDeliveryPhoneNumber(data[0].phoneNumber || 0);
//     };

//     getUID();
//   }, []);

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     fetch("/api/updateUser", {
//       method: "POST",
//       body: JSON.stringify({
//         _id: currentUID,
//         fullName,
//         deliveryAddress,
//         deliveryPhoneNumber,
//       }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           alert("Could not upload form data, try again later!");
//           return;
//         }
//         initializePayment(onSuccess, onClose);
//       })
//       .catch((err) => {
//         console.log(err, "this didnt");
//       });
//   }

  return (
    <WrapperCard>
      <button
        style={{ position: "absolute", top: 0, right: 0 }}
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBackRoundedIcon />
      </button>
      <form>
        <p className="section-title" style={{ alignItems: "center", display: "flex", justifyContent: "center" }}>Shipping </p>
        {/* <TextField
          required
          label="Phone Number"
          type="number"
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setDeliveryPhoneNumber(Number(e.target.value));
          }}
          value={deliveryPhoneNumber}
        /> */}
        {/* <Card
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p style={{ fontSize: "0.8rem", color: "grey", padding: "1rem 0" }}>
              {deliveryAddress || "Add An Address"}
            </p>
          </div>
          
        </Card> */}
        <TextField
          required
          label="Email"
          type="email"
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
        <TextField
          required
          label="Phone Number"
          type="number"
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setPhoneNumber(Number.parseInt(e.target.value));
          }}
          value={PhoneNumber}
        />
         <TextField
          required
          label="Full Name"
          type="name"
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setFullName(e.target.value);
          }}
          value={fullName}
        />
        <TextField
          required
          label="Street Name"
          type="text"
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setStreetAddress(e.target.value);
          }}
          value={StreetAddress}
        />
        
        <div style={{ display: "flex" }}>
        <TextField
          required
          label="Unit"
          type="number"
          className="input-field"
          margin="normal"
          value={Unit}
          onChange={(e) => {
            setUnit(Number.parseInt(e.target.value));
          }}
        />

        <TextField
          required
          label="lga"
          type="text"
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setCity(e.target.value);
          }}
          value={city}
        />
        </div>

         <div style={{ display: "flex" }}>
        <TextField
          required
          label="Postal"
          type="number"
          className="input-field"
          margin="normal"
          value={Postal}
          onChange={(e) => {
            setPostal(Number.parseInt(e.target.value));
          }}
        />

        <TextField
          required
          label="State"
          type="text"
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setState(e.target.value);
          }}
          value={state}
        />

         <TextField
          required
          label="Country"
          type="text"
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setCountry(e.target.value);
          }}
          value={country}
        />
        </div>

         <div style={{ textAlign: "center", color: "white" }} className="Submitbtn">
        <button style={{ background: "gray", borderRadius: "6px", padding: "12px 80px",  }} onClick={(e) => handleSubmit(e)}>
          Save Address  
        </button>
        </div>

     </form>    
    </WrapperCard>
  );
};

export default ShippingPage;
