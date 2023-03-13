import { TextField } from "@mui/material";
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
  const { getTotalCartPrice, cartItems } = useShoppingCart();
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState<number>(0);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const shippingFees = 2920;
  const totalAmount = getTotalCartPrice() + shippingFees;

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
        <TextField
          required
          label="Phone Number"
          type="number"
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setDeliveryPhoneNumber(Number(e.target.value));
          }}
          value={deliveryPhoneNumber}
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
          label="Address"
          multiline
          rows={4}
          className="input-field"
          margin="normal"
          onChange={(e) => {
            setDeliveryAddress(e.target.value);
          }}
          value={deliveryAddress}
        />

        <p className="section-title">Delivery Method</p>
        <Card>
          <div>
            <span style={{ fontWeight: 600, fontSize: "1.2rem" }}>
              Door Delivery
            </span>
            <div>
              Delivered between Thursday 3 Nov and Monday 7 Nov for{" "}
              <b>{formatCurrency(shippingFees)}</b>
            </div>
          </div>
        </Card>
        <p className="section-title">Shipment Details</p>
        <Card>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid
          error explicabo quasi cumque adipisci qui hic, obcaecati quas omnis p
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde voluptas
          ab, praesentium placeat, officia mollitia magni similique commodi
          temporibus totam sunt nihil! Maiores cumque odit quis laboriosam?
          Quisquam, in atque.
        </Card>
        <Card>
          <div className="item-details-container">
            <div>
              <b>Items Total</b>
            </div>
            <div>{formatCurrency(getTotalCartPrice())}</div>
          </div>
          <div className="item-details-container">
            <b>Shipping Fees</b>
            <div>{formatCurrency(shippingFees)}</div>
          </div>
          <hr />
          <div className="item-details-container" id="total-container">
            <div>Total</div>
            <div style={{ color: "orange" }}>{formatCurrency(totalAmount)}</div>
          </div>
          <button type="submit" style={{ width: "100%" }}>
            Pay
          </button>
          <button style={{ width: "100%" }}>Pay With Wallet</button>
        </Card>
      </form>
    </Wrapper>
  );
};

export default CheckoutPage;
