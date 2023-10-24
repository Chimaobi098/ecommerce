'use client';

import { useShippingData } from "../context/shippingContext";
import { Button, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useShoppingCart } from "../context/shoppingCart";
import { Wrapper, Card } from "../components/Checkout/checkoutPage.styles";
import { formatCurrency } from "../utils/currencyFormatter";
import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/router";
import { usePaystackPayment } from "react-paystack";
import { sanityClient } from "../lib/sanity";
import { v4 as uuidv4 } from "uuid";
import { User } from "../interfaces/interface";
import { border } from "@mui/system";
import Arrowbutton from '../public/upArrow.svg';
import Image from "next/image";
import './productcheckout.module.css';

interface OrderInfo {
    title: string;
    currentUID: string;
    totalPrice: number;
    isDelivered: boolean;
  }

const Productcheckout = ({ user }: User) => {   
  const router = useRouter();
  const [currentUID, setCurrentUID] = useState<string>("");
  const [couponCode, setCouponCode] = useState(0);
  const { getTotalCartPrice, cartItems } = useShoppingCart();
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState<number>(0);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const shippingFees = 2920;
  const totalAmount =
    getTotalCartPrice() -
    (getTotalCartPrice() * (couponDiscount / 100) || 1) +
    shippingFees;
  const [discount, setDiscount] = useState(false);


  const config = {
    amount: totalAmount * 100, // converting to kobo for paystack
    publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  };
  const initializePayment = usePaystackPayment(config);
  const { shippingData } = useShippingData();


  // async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  //   e.preventDefault();

  //   fetch("/api/updateUser", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       _id: currentUID,
  //       fullName,
  //       deliveryAddress,
  //       deliveryPhoneNumber,
  //     }),
  //   })
  //     .then((res) => {
  //       if (!res.ok) {
  //         alert("Could not upload form data, try again later!");
  //         throw new Error("Request failed with status: " + Response.status);
  //         return;
  //       }
  //       // Rest of your code for a successful response
  //       initializePayment(onSuccess, onClose);
  //     })
  //     .catch((err) => {
  //       console.log(err, "this didnt");
  //       console.error("Fetch error:", err);
  //       // Handle the error (e.g., show an error message to the user)
  //     });
  // }

      


    const handleShippingAddress = (e) => {    
     e.preventDefault();
     router.push('/shippingPage')
     // Your code logic
    } 
 
 
    function showDiscount(e) {
      e.preventDefault();
      setDiscount(!discount);  
        
    }

    const handleDiscount = (e) => {
       e.preventDefault();
       setCouponCode(couponCode);

    }

    return (
    <div>
     

      <Wrapper>
      <button
        style={{ position: "absolute", top: 0, right: 0 }}
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBackRoundedIcon />
      </button>
      <form>
        <p style={{ textAlign: 'center' }} className="section-title">Checkout</p>
        
        <Card
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)"
          }}
        >
          <div>
            <h2 style={{ fontWeight: "semi", fontSize: "1rem" }}>Shipping</h2>
            <p style={{ fontSize: "0.8rem", color: "grey", padding: "0.1rem 0" }}>
              {shippingData?.StreetAddress}
              {shippingData?.Postal}
            </p>
          </div>
          <button onClick={(e) =>{ 
           handleShippingAddress(e);
          }
          } 
           style={{ background: 'lightgray', padding: '12px', borderRadius: '7px' }} className="Add-button">
            Add
          </button>
          
        </Card>


        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", }}> 
          <div style={{ }}>
            <h2 style={{ fontWeight: "semi", fontSize: "1rem" }}>{couponCode == 0 ? "Enter Discount code" : "Discount code" }  </h2>
            <p style={{ fontSize: "0.8rem", color: "grey", padding: "0.1rem 0" }}>
              { couponCode || ""}
            </p>
          </div>
          {couponCode == "" ?   
          <button style={{ background: 'lightgray', padding: '12px', borderRadius: '7px'  }} className="Add-button" onClick={(e) => { 
            e.preventDefault();
            showDiscount(e);
          }
          }>
            <Image src={Arrowbutton} width={10} height={10} alt="arrow-image" />
          </button>   
          :  ""
           }
           </div>


          {discount ? ( 
            <div className="discount-dropdown" style={{ position: "relative", top: "10px",  width: "320px", padding: "20px" }}> 
            <form style={{ width: "270px", border: "2px solid", borderRadius: "7px", marginBottom: "15px", padding: "10px" }}>
              <input type="number" 
                 onChange={(e) => setCouponCode(e.target.value)}
                value={couponCode} 
                placeholder="yyyyyyy" 
                className="couponform" 
              />
             </form> 
             <button onClick={handleDiscount} style={{ border: "2px solid green", color: "white", backgroundColor: "green", borderRadius: "12px", width: "270px", padding: "10px" }} className="couponbtn">
               Apply
             </button>
             </div>      
          )  : (
            ""
          )
        }
        </Card>

             

        <Card>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>Summary</h2>

          <div className="item-details-container">
            <div>
              <b>Sub Total</b>
            </div>
            <div>{formatCurrency(getTotalCartPrice())}</div>
          </div>
          <div className="item-details-container">
            <div>
              <b>Discount</b>
            </div>
            <div>{`${couponDiscount}%`}</div>
          </div>
          <div className="item-details-container">
            <b>Shipping</b>
            <div>{formatCurrency(shippingFees)}</div>
          </div>
          <hr />
          <div className="item-details-container" id="total-container">
            <div>{`${2} items`}</div>
            <div style={{ display: "flex", gap: "1rem" }}>
              <div>Total</div>
              <div style={{ color: "orange" }}>
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>


         <button style={{ background: "gray", margin: "0 auto", borderRadius: "6px", padding: "9px", textAlign: "center", justifyContent: "center", display: "flex", width:"70%", border: "1px solid black" }}>
          Submit Order
         </button>
          
        </Card>
      </form>
      
    </Wrapper>
    </div>
  )
}

export default Productcheckout;





/***
 * <div>
        <div>coupon</div>
        <form
          onSubmit={async (e) => {
            e.preventDefault();

            sanityClient
              .fetch(
                `
*[_type=='coupons'&&couponCode==$couponCode]`,
                {
                  couponCode: couponCode,
                }
              )
              .then((res) => {
                if (res.length > 0) {
                  alert(
                    `Your discount of ${res[0].discountPercentage} has been applied`
                  );
                  setCouponDiscount(res[0].discountPercentage);
                } else {
                  alert("Invalid Coupon");
                }
              })
              .catch((err) => console.log(err));
          }}
        >
          <input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Button type="submit">Apply</Button>
        </form>
      </div>
 * 
 * 
 * 
 * 
 * <button type="submit" style={{ width: "100%" }}>
            Pay
          </button>
          <button style={{ width: "100%" }}>Pay With Wallet</button>
 * 
import { Button, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { useShoppingCart } from "../../context/shoppingCart";
import { Wrapper, Card } from "./checkoutPage.styles";
import { formatCurrency } from "../../utils/currencyFormatter";
import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/router";
import { usePaystackPayment } from "react-paystack";
import { sanityClient } from "../../lib/sanity";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../interfaces/interface";

interface OrderInfo {
  title: string;
  currentUID: string;
  totalPrice: number;
  isDelivered: boolean;
}

const CheckoutPage = ({ user }: User) => {
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
  const router = useRouter();
  const [currentUID, setCurrentUID] = useState<string>("");
  const [couponCode, setCouponCode] = useState("");
  const { getTotalCartPrice, cartItems } = useShoppingCart();
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState<number>(0);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const shippingFees = 2920;
  const totalAmount =
    getTotalCartPrice() -
    (getTotalCartPrice() * (couponDiscount / 100) || 1) +
    shippingFees;

  const config = {
    email: user!.email!,
    amount: totalAmount * 100, // converting to kobo for paystack
    publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  };
  const initializePayment = usePaystackPayment(config);

  useEffect(() => {
    const getUID = async () => {
      const data = await sanityClient.fetch(
        `
*[_type == 'users' && userId ==$auth0ID]{
  _id,
  name,
  phoneNumber,
  address
}`,
        {
          auth0ID: user.sub,
        }
      );

      setCurrentUID(data[0]._id || "");
      setFullName(data[0].name || "");
      setDeliveryAddress(data[0].address || "");
      setDeliveryPhoneNumber(data[0].phoneNumber || 0);
    };

    getUID();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    fetch("/api/updateUser", {
      method: "POST",
      body: JSON.stringify({
        _id: currentUID,
        fullName,
        deliveryAddress,
        deliveryPhoneNumber,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          alert("Could not upload form data, try again later!");
          return;
        }
        initializePayment(onSuccess, onClose);
      })
      .catch((err) => {
        console.log(err, "this didnt");
      });
  }

  return (
    <Wrapper>
      <button
        style={{ position: "absolute", top: 0, right: 0 }}
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBackRoundedIcon />
      </button>
      <form onSubmit={handleSubmit}>
        <p className="section-title">Delivery Info</p>
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
        /> }  
//         <Card
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <div>
//             <h2 style={{ fontWeight: "semi", fontSize: "1rem" }}>Shipping</h2>
//             <p style={{ fontSize: "0.8rem", color: "grey", padding: "1rem 0" }}>
//               {deliveryAddress || "Add An Address"}
//             </p>
//           </div>
//           <ArrowBackRoundedIcon />
//         </Card>
//         <TextField
//           required
//           label="Full Name"
//           type="name"
//           className="input-field"
//           margin="normal"
//           onChange={(e) => {
//             setFullName(e.target.value);
//           }}
//           value={fullName}
//         />
//         <TextField
//           required
//           label="Address"
//           multiline
//           rows={4}
//           className="input-field"
//           margin="normal"
//           onChange={(e) => {
//             setDeliveryAddress(e.target.value);
//           }}
//           value={deliveryAddress}
//         />

//         <p className="section-title">Delivery Method</p>
//         <Card>
//           <div>
//             <span style={{ fontWeight: 600, fontSize: "1.2rem" }}>
//               Door Delivery
//             </span>
//             <div>
//               Delivered between Thursday 3 Nov and Monday 7 Nov for{" "}
//               <b>{formatCurrency(shippingFees)}</b>
//             </div>
//           </div>
//         </Card>

//         <Card>
//           <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>Summary</h2>

//           <div className="item-details-container">
//             <div>
//               <b>Sub Total</b>
//             </div>
//             <div>{formatCurrency(getTotalCartPrice())}</div>
//           </div>
//           <div className="item-details-container">
//             <div>
//               <b>Discount</b>
//             </div>
//             <div>{`${couponDiscount}%`}</div>
//           </div>
//           <div className="item-details-container">
//             <b>Shipping</b>
//             <div>{formatCurrency(shippingFees)}</div>
//           </div>
//           <hr />
//           <div className="item-details-container" id="total-container">
//             <div>{`${2} items`}</div>
//             <div style={{ display: "flex", gap: "1rem" }}>
//               <div>Total</div>
//               <div style={{ color: "orange" }}>
//                 {formatCurrency(totalAmount)}
//               </div>
//             </div>
//           </div>

//           <button type="submit" style={{ width: "100%" }}>
//             Pay
//           </button>
//           <button style={{ width: "100%" }}>Pay With Wallet</button>
//         </Card>
//       </form>
//       <div>
//         <div>coupon</div>
//         <form
//           onSubmit={async (e) => {
//             e.preventDefault();

//             sanityClient
//               .fetch(
//                 `
// *[_type=='coupons'&&couponCode==$couponCode]`,
//                 {
//                   couponCode: couponCode,
//                 }
//               )
//               .then((res) => {
//                 if (res.length > 0) {
//                   alert(
//                     `Your discount of ${res[0].discountPercentage} has been applied`
//                   );
//                   setCouponDiscount(res[0].discountPercentage);
//                 } else {
//                   alert("Invalid Coupon");
//                 }
//               })
//               .catch((err) => console.log(err));
//           }}
//         >
//           <input
//             value={couponCode}
//             onChange={(e) => setCouponCode(e.target.value)}
//           />
//           <Button type="submit">Apply</Button>
//         </form>
//       </div>
//     </Wrapper>
//   );
// };

// export default CheckoutPage;














 */