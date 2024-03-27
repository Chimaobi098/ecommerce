import React, { useState, useEffect, useRef } from "react";
import {
  CartItemWrapper,
  Deletebutton,
  CheckoutButton,
  CheckoutButtonWrapper,
  CheckoutDetails,
  ProudctInfo,
  Wrapper,
  ProductInfoWrapper,
} from "./shoppingCartOverlay.styles";
import { CartButtons } from "../productInfoOverly/prodInfoOverlay.styles";
import { useShoppingCart } from "../../context/shoppingCart";
import { Header } from "./shoppingCartOverlay.styles";
import { urlFor } from "../../lib/sanity";
import { AnimatePresence, motion } from "framer-motion";
import { formatCurrency } from "../../utils/currencyFormatter";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { sanityClient } from "../../lib/sanity";
import { useRouter } from "next/router";
import { Swipeable } from "react-swipeable";
import  Button  from "@mui/material/Button";
 //import { useNavigate } from "react-router-dom"
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import  Card  from "@mui/material/Card";
import { useShippingData } from "../../context/shippingContext";
import downarrow from "../../public/noun-chevron-arrow-2074151.svg"; 
import { WrapperCard, CardStyle } from "../Checkout/checkoutPage.styles";
import Image from "next/image";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import { ArrowForwardIos, CloseOutlined, Info, SwapHorizRounded } from "@mui/icons-material";
import { useUser } from '@auth0/nextjs-auth0/dist/frontend/use-user'
import useAppAuth, { FbUser } from "../../utils/firebase";


  
const ShoppingCartOverlay = () => {
  const router = useRouter();
  const [serviceFee, setServiceFee] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const {
    setCartOpen,
    cartItems,
    setCartItems,
    handleItemClick,
    removeFromCart,
    removeAllCartItems,
    increaseCart,
    decreaseCart,
    getTotalCartPrice,
  } = useShoppingCart();

  const {
    getUserFromLocalStorage,
    updateFieldsInFirebase,
  } = useAppAuth();

  function getUserDetails(){
    let user = getUserFromLocalStorage();

    setuserDetails(JSON.parse(user));
  }
  
  

  // const navigate = useNavigate();
  const [couponDiscount, setCouponDiscount] = useState(0);
  // const [discount, setDiscount] = useState(false);
  const [walletSwitch, setWalletSwitch] = useState(true)
  const { shippingData } = useShippingData();
  const [couponCode, setCouponCode] = useState(0);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [routeCtrl, setRouteCtrl] = useState(0)
  const [modal, setModal] = useState({
    show: false, orderSuccess: false
  })
  
  const [userDetails, setuserDetails] = useState('')
  // const { user, error } = useUser();
    
    // const serviceFee = getTotalCartPrice() * 0.25;

    // const deliveryFee = getTotalCartPrice() * 0.25;

 
    const [dragItems, setDragItems] = useState(
      cartItems.map((item) => {
        return { productId: item._id, isShowingDelete: false };
      })
    );
  
    useEffect(() => {
      getUserDetails()

      
    }, [])

    useEffect(()=>{
      if(userDetails){
        let cartTotal = getTotalCartPrice()
      if(userDetails.gameWalletBalance >= cartTotal){
        setServiceFee(cartTotal * 0.25)
      }
      else{
        setServiceFee(0)
      }
      }
      
    }, [userDetails])

    useEffect(()=>{
      let value =
      getTotalCartPrice() +
      serviceFee -
      getTotalCartPrice() * (couponDiscount / 100);

      setTotalAmount(value)
    }, [serviceFee])

    function handleDragEnd(event, id) {
      const isTouch = event.pointerType == "touch" ? true : false;
  
      console.log(event);
      const dragOffset = isTouch ? 200 : 600; // smaller means draw futher back for delete
  
      if (event.pageX > dragOffset) {
        setDragItems((prev) => {
          const newDragging = [...prev];
          const finalDragging = newDragging.map((draggingItem) => {
            if (draggingItem.productId == id) {
              draggingItem.isShowingDelete = false;
            }
            return draggingItem;
          });
          console.log(finalDragging);
          return finalDragging;
        });
      }
    }



  function handleCheckout(e) {
   
    e.preventDefault();
    // setCartOpen(false);
    setCheckoutMode(true);
    router.push("/Itemcheckout"); 
   }

   const handleShippingAddress = (e) => {    
    e.preventDefault();
    setCartOpen(false);
    router.push('/profile/address')
   }

   function showDiscount(e) {
    e.preventDefault();
    setDiscount(!discount);  
      
  }

  const handleDiscount = (e) => {
     e.preventDefault();
     setCouponCode(couponCode);

  }

  function validateOrder(){
    if (userDetails.gameWalletBalance >= totalAmount){
      onSuccess('game')
    }else if(userDetails.walletBalance >= totalAmount){ 
      onSuccess('cash')
    }
    else{
      setModal({ show: true, orderSuccess: false });
    }
  }

  const onSuccess = async (walletType) => {

    if(walletType == 'game'){
      await updateFieldsInFirebase(userDetails.email, {
        gameWalletBalance: userDetails.gameWalletBalance - totalAmount,
        walletBalance: userDetails.walletBalance - serviceFee,
      });
    }
    
    if(walletType == 'cash'){
      await updateFieldsInFirebase(userDetails.email, {
        walletBalance: userDetails.walletBalance - totalAmount,
      });
    }

    setModal({ show: true, orderSuccess: true });
    removeAllCartItems("null");
  };

  const [carddetails, setcarddetails] = useState(false);

  const handleCard = () => {
    setcarddetails(!carddetails);
  };

  const [info, setInfo] = useState({
    title: '',
    mssg: ''
  })

  function handleInfo(Title, Mssg){
    setInfo({title: Title, mssg: Mssg})
  }

  //  This is to catch if the user is using the browser's navigation buttons to go back in router history
   if(router.pathname == '/' && checkoutMode && routeCtrl == 0){
    // alert('router control + 1')
    setRouteCtrl(routeCtrl + 1)
   }
   if(router.pathname == '/Itemcheckout' && checkoutMode && routeCtrl == 1){
    // alert('router control = 2')
    setRouteCtrl(routeCtrl + 1)
   }
   if(router.pathname == '/' && checkoutMode && routeCtrl == 2){
    // alert('router control back to 0')
    setRouteCtrl(0)
    setCheckoutMode(false)
   }
   
  return (
    <>
    {checkoutMode ? (
      <>
      <h1 className="absolute top-0 z-[1] w-full text-center bg-[#f5f5f5] left-0"
      style={{fontWeight: 500, fontSize: '1.5rem'}}>Checkout</h1>
      <WrapperCard>
      
      <button className="absolute top-[5px] left-[2%] z-[2]"
        onClick={() => {
          router.push('/');
          setRouteCtrl(0);
          setCheckoutMode(false);
        }}
      >
        <ArrowBackIos />
      </button>

      
      <form> 
        <CardStyle
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)",
            marginTop: 50
          }}
        >
          <div>
            <h2 style={{ fontWeight: "semi", fontSize: "1rem" }}>Delivery</h2>
            <p style={{ fontSize: "0.8rem", color: "grey", padding: "0.1rem 0" }}>
              {userDetails==''? '------':
                <span>{userDetails.address1}<br/>
                      {userDetails.city}, {userDetails.state}<br/>
                      {userDetails.country}
                </span>}
            
            </p>
          </div>

          <button onClick={(e) =>{ 
           handleShippingAddress(e)}} className="Add-button">
            <ArrowForwardIos style={{fontSize: '15px'}}/>
          </button>
          
        </CardStyle>


        {/* <CardStyle
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
            <p style={{ fontSize: "0.8rem", color: "white", padding: "0.1rem 0" }}>
              { couponCode || ""}
            </p>
          </div>
          {couponCode == 0 ?   
          <button className="Add-button" onClick={(e) => { 
            e.preventDefault();
            showDiscount(e);
          }
          }>
            <ArrowForwardIos style={{fontSize: '15px'}}/>
          </button>   
          :  ""
           }
           </div>


          {discount ? ( 
            <div className="discount-dropdown py-[20px]" style={{ position: "relative", top: "10px",  width: "80%" }}> 
            <form style={{ width: "100%", border: "2px solid", borderRadius: "7px", marginBottom: "15px", padding: "10px", overflow: "hidden" }}>
              <input type="number" 
                 onChange={(e) => setCouponCode(Number.parseInt(e.target.value))}
                value={couponCode == 0? '': couponCode} 
                placeholder="Enter coupon code" 
                className="couponform focus:outline-none"
                style={{width: '100%'}}
              />
             </form> 
             <button onClick={handleDiscount} style={{ border: "2px solid green", color: "white", backgroundColor: "green", borderRadius: "12px", width: "100%", padding: "10px" }} className="couponbtn">
               Apply
             </button>
             </div>      
          )  : (
            ""
          )
        }
        </CardStyle> */}

        <motion.div whileTap={{scale: 0.95}} onClick={()=>{setWalletSwitch(!walletSwitch)}}
        className="p-0 mb-[13.34px]" >
        <CardStyle
          style={{boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)", marginBottom: 0}}>
          <h2 style={{ fontWeight: "semi", fontSize: "1rem", textAlign: 'left', marginBottom: '1rem' }}>Wallet</h2>

          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", }}> 
            
            <div>
            <span>{walletSwitch?'Game wallet':'Cash wallet'}</span>
            </div>
            <div>{walletSwitch? formatCurrency(userDetails.gameWalletBalance): formatCurrency(userDetails.walletBalance) }</div>           
          </div>
          <div style={{ display: "flex", justifyContent: "center", width: "100%"}}>
            <SwapHorizRounded className="text-[gray] scale-[1.3]"/>
          </div>  
        </CardStyle>
        </motion.div>

             

        <CardStyle style={{ boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)"}} >
          <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem" }}>Summary</h2>

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
          {/* <div className="item-details-container">
            <div className="flex items-center gap-1">
             <b>Delivery Fee</b> 
             <Info className="text-[gray] scale-[0.7]" 
              onClick={() => {
                handleInfo('Delivery Fee','The cost of delivering products to your location'),
                handleCard()}}/>
            </div>
            <div>{formatCurrency(deliveryFee)}</div>
          </div> */}
          
          <div className="item-details-container" id="total-container">
            <div>{cartItems.length > 1? `${cartItems.length} items`: `${cartItems.length} item`}</div>
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
        <button type="button"
        onClick={() => {validateOrder()}}
        style={{ background: "green", color: "white",  margin: "20px auto", borderRadius: "6px", padding: "9px", textAlign: "center", justifyContent: "center", display: "flex", width:"80%", border: "1px solid green" }}>
          Submit Order
         </button>{modal.show ? (
        <>
          <div
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              
               
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                     {modal.orderSuccess? 
                      'Your order has been placed successfully':'Insufficient balance'}
                  </p>
                </div>
                {/*footer*/}
                <div className={`flex items-center ${modal.orderSuccess?'justify-end':'justify-between'}  px-4 py-6 border-t border-solid border-blueGray-200 rounded-b`} >
                  {!modal.orderSuccess && (<button 
                    className="text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={()=>{ setModal({show: false, orderSuccess: true}), setCartOpen(false), router.push('/profile/wallet')}}>
                        Fund Cash Wallet
                  </button>)}
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => (modal.orderSuccess?
                      (setModal({show: false, orderSuccess: true}), getUserDetails(),setCartOpen(false), router.push('/')): setModal({show: false, orderSuccess: false}))}
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
    </>) : ""}
    <Wrapper initial={{ y: "100vh" }} animate={{ y: 0 }} exit={{ y: "100vh" , transition: {duration: 0.1} }} style={{position: 'relative', zIndex: 99}}>
      <Header>
        <button
          onClick={() => {
            // alert(router.pathname)
            // router.push('/');
            setCartOpen(false);
          }}
        >
          <ClearOutlinedIcon />
        </button>
        <span style={{ fontWeight: 500 }}>Bag</span>
        <div></div>
      </Header>
      <AnimatePresence>
        <CartItemWrapper>
          {cartItems.map((item, index) => {
            const currentItemState = dragItems.find(
              (dragItem) => item._id == dragItem.productId
            );
            console.log("this is the current item state", currentItemState);
            return (
              <ProductInfoWrapper key={index}>
                <Button
                  onClick={() => {
                    removeFromCart(item._id);
                  }}
                >
                  <DeleteRoundedIcon sx={{ color: "white" }} />
                </Button>
                <ProudctInfo
                  // onClick={() => handleItemClick(item._id)}
                  className="h-40 pl-2 -mr-4 pt-2 relative"
                  key={item._id}
                  transition={{ type: "tween" }}
                  drag="x"
                  onDragStart={(event, info) => {
                    setDragItems((prev) => {
                      const newDragging = [...prev];
                      const finalDragging = newDragging.map((draggingItem) => {
                        if (draggingItem.productId == item._id) {
                          draggingItem.isShowingDelete = true;
                        }
                        return draggingItem;
                      });
                      console.log(finalDragging);
                      return finalDragging;
                    });
                  }}
                  onDragEnd={(event) => handleDragEnd(event, item._id)}
                  dragSnapToOrigin
                  style={{
                    left: `-${currentItemState?.isShowingDelete ? 100 : 0}px`,
                    bottom: -11,
                  }}
                  dragTransition={{ bounceStiffness: 900, bounceDamping: 100 }}
                >
                  <img
                    id="product-image"
                    src={urlFor(
                      item.isVariant
                        ? item?.images[0]
                        : item?.defaultProductVariant.images[0]
                    ).url()}
                    alt="prouduct image"
                    className="h-40"
                  />
                  <div className=" h-40 flex flex-col justify-between w-full pl-2">
                    <div className="flex flex-row justify-between">
                      <div className=" text-lg w-9/12">
                        <span>{item.title}</span>
                        <div className="text-lg">
                          {formatCurrency(
                            item.isVariant
                              ? item.price
                              : item.defaultProductVariant.price
                          )}
                        </div>
                      </div>
                      <div className="w-3/12 flex justify-center">
                        {/* <button
                          className="text-black"
                          onClick={() => {
                            removeFromCart(item._id);
                          }}
                          id="remove-product"
                        >
                          <DeleteRoundedIcon fontSize="medium" />
                        </button> */}
                      </div>
                    </div>
                    {/* <div id="product-total-cost">
                  {formatCurrency(item.totalPrice)}
                </div> */}

                    <div className="flex justify-between">
                      <div></div>
                      <div className="flex flex-row w-20 cursor-pointer justify-evenly text-xl text-gray-300">
                        <div
                          onClick={() => {
                            decreaseCart(item._id);
                          }}
                        >
                          -
                        </div>
                        <div className="bg-gray-100  px-3 text-base flex items-center text-black">
                          {item.quantity}
                        </div>
                        <div
                          onClick={() => {
                            increaseCart(item._id);
                          }}
                        >
                          +
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <Deletebutton onClick={() => {
                removeFromCart(item._id);
              }}> */}

                  {/* </Deletebutton> */}
                </ProudctInfo>
              </ProductInfoWrapper>
            );
          })}
        </CartItemWrapper>
        <CheckoutDetails className="">
          <div id="cart-details-wrapper">
            <div id="cart-item-count">{cartItems.length} items</div>
            <div id="checkout-price">
              Total:{" "}
              <span id="price">{formatCurrency(getTotalCartPrice())}</span>
            </div>
          </div>
          <hr />

          <div className=" flex flex-row h-12 w-full justify-evenly mt-2 mb-8 lg:mb-0 px-2 gap-x-4">
            <button
              className="bg-black h-full rounded-md w-full text-white"
              onClick={(e) => handleCheckout(e)}
            >
              Checkout
            </button>
            {/* <button className="text-black h-full rounded-md w-6/12 bg-white border border-black">
            Play
          </button> */}
          </div>
        </CheckoutDetails>
      </AnimatePresence>
    </Wrapper>

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
    )
  
  }

  

  

  // return (
  //   <Wrapper initial={{ y: "100vh" }} animate={{ y: 0 }} exit={{ y: "100vh" }}>
  //     <Header>
  //       <button
  //         onClick={() => {
  //           setCartOpen(false);
  //         }}
  //       >
  //         <ClearOutlinedIcon />
  //       </button>
  //       <span style={{ fontWeight: 500 }}>Bag</span>
  //       <div></div>
  //     </Header>
  //     <AnimatePresence>
  //       <CartItemWrapper>
  //         {cartItems.map((item, index) => {
  //           const currentItemState = dragItems.find(
  //             (dragItem) => item._id == dragItem.productId
  //           );
  //           console.log("this is the current item state", currentItemState);
  //           return (
  //             <ProductInfoWrapper key={index}>
  //               <Button
  //                 onClick={() => {
  //                   removeFromCart(item._id);
  //                 }}
  //               >
  //                 <DeleteRoundedIcon sx={{ color: "white" }} />
  //               </Button>
  //               <ProudctInfo
  //                 // onClick={() => handleItemClick(item._id)}
  //                 className="h-40 pl-2 -mr-4 pt-2 relative"
  //                 key={item._id}
  //                 transition={{ type: "tween" }}
  //                 drag="x"
  //                 onDragStart={(event, info) => {
  //                   setDragItems((prev) => {
  //                     const newDragging = [...prev];
  //                     const finalDragging = newDragging.map((draggingItem) => {
  //                       if (draggingItem.productId == item._id) {
  //                         draggingItem.isShowingDelete = true;
  //                       }
  //                       return draggingItem;
  //                     });
  //                     console.log(finalDragging);
  //                     return finalDragging;
  //                   });
  //                 }}
  //                 onDragEnd={(event) => handleDragEnd(event, item._id)}
  //                 dragSnapToOrigin
  //                 style={{
  //                   left: `-${currentItemState?.isShowingDelete ? 100 : 0}px`,
  //                   bottom: -11,
  //                 }}
  //                 dragTransition={{ bounceStiffness: 900, bounceDamping: 100 }}
  //               >
  //                 <img
  //                   id="product-image"
  //                   src={urlFor(
  //                     item.isVariant
  //                       ? item?.images[0]
  //                       : item?.defaultProductVariant.images[0]
  //                   ).url()}
  //                   alt="prouduct image"
  //                   className="h-40"
  //                 />
  //                 <div className=" h-40 flex flex-col justify-between w-full pl-2">
  //                   <div className="flex flex-row justify-between">
  //                     <div className=" text-lg w-9/12">
  //                       <span>{item.title}</span>
  //                       <div className="text-lg">
  //                         {formatCurrency(
  //                           item.isVariant
  //                             ? item.price
  //                             : item.defaultProductVariant.price
  //                         )}
  //                       </div>
  //                     </div>
  //                     <div className="w-3/12 flex justify-center">
  //                       {/* <button
  //                         className="text-black"
  //                         onClick={() => {
  //                           removeFromCart(item._id);
  //                         }}
  //                         id="remove-product"
  //                       >
  //                         <DeleteRoundedIcon fontSize="medium" />
  //                       </button> */}
  //                     </div>
  //                   </div>
  //                   {/* <div id="product-total-cost">
  //                 {formatCurrency(item.totalPrice)}
  //               </div> */}

  //                   <div className="flex justify-between">
  //                     <div></div>
  //                     <div className="flex flex-row w-20 cursor-pointer justify-evenly text-xl text-gray-300">
  //                       <div
  //                         onClick={() => {
  //                           decreaseCart(item._id);
  //                         }}
  //                       >
  //                         -
  //                       </div>
  //                       <div className="bg-gray-100  px-3 text-base flex items-center text-black">
  //                         {item.quantity}
  //                       </div>
  //                       <div
  //                         onClick={() => {
  //                           increaseCart(item._id);
  //                         }}
  //                       >
  //                         +
  //                       </div>
  //                     </div>
  //                   </div>
  //                 </div>

  //                 {/* <Deletebutton onClick={() => {
  //               removeFromCart(item._id);
  //             }}> */}

  //                 {/* </Deletebutton> */}
  //               </ProudctInfo>
  //             </ProductInfoWrapper>
  //           );
  //         })}
  //       </CartItemWrapper>
  //       <CheckoutDetails className="">
  //         <div id="cart-details-wrapper">
  //           <div id="cart-item-count">{cartItems.length} items</div>
  //           <div id="checkout-price">
  //             Total:{" "}
  //             <span id="price">{formatCurrency(getTotalCartPrice())}</span>
  //           </div>
  //         </div>
  //         <hr />

  //         <div className=" flex flex-row h-12 w-full justify-evenly mt-2 mb-8 lg:mb-0 px-2 gap-x-4">
  //           <button
  //             className="bg-black h-full rounded-md w-full text-white"
  //             onClick={(e) => handleCheckout(e)}
  //           >
  //             Checkout
  //           </button>
  //           {/* <button className="text-black h-full rounded-md w-6/12 bg-white border border-black">
  //           Play
  //         </button> */}
  //         </div>
  //       </CheckoutDetails>
  //     </AnimatePresence>
  //   </Wrapper>
  // );



export default ShoppingCartOverlay;


// export function goToPage(router){
//   router.push("/Itemcheckout");
// }


