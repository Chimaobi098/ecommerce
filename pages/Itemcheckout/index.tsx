"use client";

import { useShippingData } from "../../context/shippingContext";
// 🚀 Fast
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import React, { useEffect } from "react";
import { useShoppingCart } from "../../context/shoppingCart";
import {
  WrapperCard,
  CardStyle,
} from "../../components/Checkout/checkoutPage.styles";
import { formatCurrency } from "../../utils/currencyFormatter";
import { useState } from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useRouter } from "next/router";
import { usePaystackPayment } from "react-paystack";
import { sanityClient, urlFor } from "../../lib/sanity";
import { v4 as uuidv4 } from "uuid";
import { User } from "../../interfaces/interface";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
//import { border } from "@mui/system";
import Arrowbutton from "../public/upArrow.svg";
import Image from "next/image";
import "../productcheckout.module.css";
import greaterIcon from "../public/greater-than-symbol.png";
import downarrow from "../../public/noun-chevron-arrow-2074151.svg";

import Addressbook from "../../components/profilePage/address/addressbook";
import { ArrowForwardIos, CloseOutlined, Info, SwapHorizRounded } from "@mui/icons-material";
import useAppAuth, { FbUser } from "../../utils/firebase";
import { motion } from "framer-motion";
//import { goToPage } from "../../components/ShoppingCart/shoppingCartOverlay";

interface OrderInfo {
  title: string;
  currentUID: string;
  totalPrice: number;
  isDelivered: boolean;
}

const ItemCheckout = () => {
  const router = useRouter();
  //const { items } = useRouter();
  //const cartItems = items ? JSON.parse(items) : [];
  const [currentUID, setCurrentUID] = useState<string>("");
  const [couponCode, setCouponCode] = useState<number>(0);
  const [userDetails, setuserDetails] = useState<any>("");

  const { getTotalCartPrice, cartItems, removeAllCartItems } =
    useShoppingCart();
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState<number>(0);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [modal, setModal] = useState({
    show: false,
    orderSuccess: false,
  });

  const { getUserFromLocalStorage } = useAppAuth();

  const user = getUserFromLocalStorage();

  useEffect(() => {
    if (user) {
      
      setuserDetails(JSON.parse(user));
    }
  }, []);

  // const { user, error } = useUser();

  const serviceFee = getTotalCartPrice() * 0.25;

  const deliveryFee = getTotalCartPrice() * 0.25;

  const totalAmount =
    getTotalCartPrice() +
    serviceFee +
    deliveryFee -
    getTotalCartPrice() * (couponDiscount / 100);

  // const [discount, setDiscount] = useState(false);
  const [walletSwitch, setWalletSwitch] = useState(true);

  const config = {
    amount: totalAmount * 100, // converting to kobo for paystack
    publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
    email: "",
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

  const handleShippingAddress = (e: any) => {
    e.preventDefault();
    router.push("/profile/address");
    // Your code logic
  };

  // function showDiscount(e: any) {
  //   e.preventDefault();
  //   setDiscount(!discount);
  // }

  const handleDiscount = (e: any) => {
    e.preventDefault();
    setCouponCode(couponCode);
  };

  function validateOrder() {
    if (userDetails.walletBalance < serviceFee) {
      setModal({ show: true, orderSuccess: false });
    } else {
      setModal({ show: true, orderSuccess: true });
      removeAllCartItems("null");
    }
  }

  const [carddetails, setcarddetails] = useState(false);

  const handleCard = () => {
    setcarddetails(!carddetails);
  };

  const [info, setInfo] = useState({
    title: '',
    mssg: ''
  })

  function handleInfo(Title :string, Mssg: string){
    setInfo({title: Title, mssg: Mssg})
  }

  return (
    <>
      <h1
        className="absolute top-0 z-[1] w-full text-center bg-[#f5f5f5] left-0"
        style={{ fontWeight: 500, fontSize: "1.5rem" }}
      >
        Checkout
      </h1>
      <WrapperCard>
        <button
          className="absolute top-[5px] left-[2%] z-[2]"
          onClick={() => {
            router.push("/");
          }}
        >
          <ArrowBackIosIcon />
        </button>
        <form>
          <CardStyle
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)",
              marginTop: 50,
            }}
          >
            <div>
              <h2 style={{ fontWeight: "semi", fontSize: "1rem" }}>Delivery</h2>
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "grey",
                  padding: "0.1rem 0",
                }}
              >
                {userDetails == "" ? (
                  "-----"
                ) : (
                  <span>
                    {userDetails.address1}
                    <br />
                    {userDetails.city}, {userDetails.state}
                    <br />
                    {userDetails.country}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={(e) => {
                handleShippingAddress(e);
              }}
              className="Add-button"
            >
              <ArrowForwardIos style={{ fontSize: "15px" }} />
            </button>
          </CardStyle>

          {/* <CardStyle
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div style={{}}>
                <h2 style={{ fontWeight: "semi", fontSize: "1rem" }}>
                  {couponCode == 0 ? "Enter Discount code" : "Discount code"}{" "}
                </h2>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "white",
                    padding: "0.1rem 0",
                  }}
                >
                  {couponCode || ""}
                </p>
              </div>
              {couponCode == 0 ? (
                <button
                  className="Add-button"
                  onClick={(e) => {
                    e.preventDefault();
                    showDiscount(e);
                  }}
                >
                  <ArrowForwardIos style={{ fontSize: "15px" }} />
                </button>
              ) : (
                ""
              )}
            </div>

            {discount ? (
              <div
                className="discount-dropdown py-[20px]"
                style={{ position: "relative", top: "10px", width: "80%" }}
              >
                <form
                  style={{
                    width: "100%",
                    border: "2px solid",
                    borderRadius: "7px",
                    marginBottom: "15px",
                    padding: "10px",
                    overflow: "hidden",
                  }}
                >
                  <input
                    type="number"
                    onChange={(e) =>
                      setCouponCode(Number.parseInt(e.target.value))
                    }
                    value={couponCode == 0 ? "" : couponCode}
                    placeholder="Enter coupon code"
                    className="couponform focus:outline-none"
                    style={{ width: "100%" }}
                  />
                </form>
                <button
                  onClick={handleDiscount}
                  style={{
                    border: "2px solid green",
                    color: "white",
                    backgroundColor: "green",
                    borderRadius: "12px",
                    width: "100%",
                    padding: "10px",
                  }}
                  className="couponbtn"
                >
                  Apply
                </button>
              </div>
            ) : (
              ""
            )}
          </CardStyle> */}

          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setWalletSwitch(!walletSwitch);
            }}
            className="p-0 mb-[13.34px]"
          >
            <CardStyle
              style={{
                boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)",
                marginBottom: 0,
              }}
            >
              <h2
                style={{
                  fontWeight: "semi",
                  fontSize: "1rem",
                  textAlign: "left",
                  marginBottom: "1rem",
                }}
              >
                Wallet
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div>
                  <span>{walletSwitch ? "Game wallet" : "Cash wallet"}</span>
                </div>
                <div>
                  {walletSwitch
                    ? formatCurrency(userDetails.gameWalletBalance? userDetails.gameWalletBalance: 0)
                    : formatCurrency(userDetails.walletBalance? userDetails.walletBalance: 0)}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <SwapHorizRounded className="text-[gray] scale-[1.3]" />
              </div>
            </CardStyle>
          </motion.div>

          <CardStyle style={{ boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)" }}>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>
              Summary
            </h2>

            <div className="item-details-container">
            <div className="flex items-center gap-1">
              <b>Sub Total</b> 
              <Info className="text-[gray] scale-[0.7]" 
              onClick={() => {
                handleInfo('Sub Total','This is the initial sum of all items in the cart'),
                handleCard()}}/>
            </div>
            <div>{formatCurrency(getTotalCartPrice())}</div>
          </div>
          <div className="item-details-container">
            <div className="flex items-center gap-1">
              <b>Service Fee</b> 
              <Info className="text-[gray] scale-[0.7]" 
              onClick={() => {
                handleInfo('Service Fee','A charge of 25% of the Sub Total to use this service'),
                handleCard()}}/>
            </div>
            <div>{formatCurrency(serviceFee)}</div>
          </div>
          <div className="item-details-container">
            <div className="flex items-center gap-1">
             <b>Delivery Fee</b> 
             <Info className="text-[gray] scale-[0.7]" 
              onClick={() => {
                handleInfo('Delivery Fee','The cost of delivering products to your location'),
                handleCard()}}/>
            </div>
            <div>{formatCurrency(deliveryFee)}</div>
          </div>

            <div className="item-details-container" id="total-container">
              <div>
                {cartItems.length > 1
                  ? `${cartItems.length} items`
                  : `${cartItems.length} item`}
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <div>Total</div>
                <div style={{ color: "orange" }}>
                  {formatCurrency(totalAmount)}
                </div>
              </div>
            </div>

            <hr />
          </CardStyle>

          <CardStyle>
            <button
              type="button"
              onClick={() => {
                validateOrder();
              }}
              style={{
                background: "green",
                color: "white",
                margin: "20px auto",
                borderRadius: "6px",
                padding: "9px",
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                width: "80%",
                border: "1px solid green",
              }}
            >
              Submit Order
            </button>
            {modal.show ? (
              <>
                <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                  <div className="relative w-auto my-6 mx-auto max-w-3xl">
                    {/*content*/}
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*body*/}
                      <div className="relative p-6 flex-auto">
                        <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                          {modal.orderSuccess
                            ? "Your order has been placed successfully"
                            : "Insufficient cash balance for service fee"}
                        </p>
                      </div>
                      {/*footer*/}
                      <div
                        className={`flex items-center ${
                          modal.orderSuccess ? "justify-end" : "justify-between"
                        }  px-4 py-6 border-t border-solid border-blueGray-200 rounded-b`}
                      >
                        {!modal.orderSuccess && (
                          <button
                            className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={() => {
                              setModal({ show: false, orderSuccess: true }),
                                router.push("/profile/wallet");
                            }}
                          >
                            Fund Cash Wallet
                          </button>
                        )}
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() =>
                            modal.orderSuccess
                              ? (setModal({ show: false, orderSuccess: true }),
                                router.push("/"))
                              : setModal({ show: false, orderSuccess: false })
                          }
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
              </>
            ) : null}
          </CardStyle>
        </form>
      </WrapperCard>

      <div
        className={`${
          carddetails
            ? "h-screen top-0 left-0 absolute w-full z-10 bg-black opacity-60"
            : ""
        }`}
        onClick={handleCard}
      ></div>

    <div
        className={` ${
          carddetails ? "translate-y-0" : "translate-y-full"
        } w-full left-0 flex flex-col text-center absolute bottom-0 z-20 bg-white rounded-t-lg gap-y-6 px-4 pb-12 transition-all duration-500 ease-in-out transform-gpu`}
      >
        <div className="flex flex-row justify-between items-end ">
          <div className="mt-8 text-2xl font-medium">{info.title}</div>
          <div>
            
            <CloseOutlined
              onClick={handleCard}
              className="text-2xl mb-2 cursor-pointer"
            />
          </div>
        </div>
        <div className="flex flex-col text-left w-full">
          {info.mssg}
        </div>
      </div>
    </>
  );
};

export default ItemCheckout;

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
import { urlFor } from '../../ecommerce.github.io/lib/sanity';
import DefaultProduct from '../components/productInfoOverly/defaultProduct';

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
