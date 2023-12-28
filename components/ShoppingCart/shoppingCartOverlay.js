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
import { AnimatePresence } from "framer-motion";
import { formatCurrency } from "../../utils/currencyFormatter";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import { ArrowForwardIos } from "@mui/icons-material";


  
const ShoppingCartOverlay = () => {
  const router = useRouter();
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


  const shippingFees = 0;
  // const navigate = useNavigate();
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [discount, setDiscount] = useState(false);
  const { shippingData } = useShippingData();
  const [couponCode, setCouponCode] = useState(0);
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [routeCtrl, setRouteCtrl] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const totalAmount =
    getTotalCartPrice() -
    (getTotalCartPrice() * (couponDiscount / 100) || 1) +
    shippingFees;  
 
    const [dragItems, setDragItems] = useState(
      cartItems.map((item) => {
        return { productId: item._id, isShowingDelete: false };
      })
    );
  
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
      <WrapperCard>
      <button
        style={{ position: "absolute", top: 0, left: '2%' }}
        onClick={() => {
          router.push('/');
          setRouteCtrl(0);
          setCheckoutMode(false)
        }}
      >
        <ArrowBackIos />
      </button>
      
      <form className="">
        <p style={{ textAlign: 'center' }} className="section-title">Checkout</p>
        
        <CardStyle
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
           handleShippingAddress(e)}} className="Add-button">
            <ArrowForwardIos style={{fontSize: '15px'}}/>
          </button>
          
        </CardStyle>


        <CardStyle
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
        </CardStyle>

             

        <CardStyle style={{ boxShadow: "0 5px 5px 1px rgb( 0, 0, 0, 0.2)"}} >
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
        onClick={() => {setShowModal(true), removeAllCartItems('null')}}
        style={{ background: "green", color: "white",  margin: "20px auto", borderRadius: "6px", padding: "9px", textAlign: "center", justifyContent: "center", display: "flex", width:"80%", border: "1px solid green" }}>
          Submit Order
         </button>{showModal ? (
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
                     your order has been sent successfully
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b" >
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => (setShowModal(false), setCartOpen(false), router.push('/'))}
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
    ) : ""}
    <Wrapper initial={{ y: "100vh" }} animate={{ y: 0 }} exit={{ y: "100vh" , transition: {duration: 0.1} }}>
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


