import { TextField } from "@mui/material";
import React from "react";
import { useShoppingCart } from "../../context/shoppingCart";
import { Wrapper, Card } from "./checkoutPage.styles";
import { formatCurrency } from "../../utils/currencyFormatter";
import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useRouter } from "next/router";
import { usePaystackPayment } from "react-paystack";
import { UserProfile } from "@auth0/nextjs-auth0";

interface CheckoutProps{
  user: UserProfile
}

const CheckoutPage= ({user}:CheckoutProps) => {
  const onSuccess = () => {
    alert("your payment was successful");
    router.push("/");
  };

  const onClose = () => {
    alert("why did you close na");
  };
  const router = useRouter();
  const { getTotalCartPrice } = useShoppingCart();
  const [deliveryPhoneNumber, setDeliveryPhoneNumber] = useState<string>("");
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const shippingFees = 2920;
  const totalAmount = getTotalCartPrice() + shippingFees;

  const config = {
    email: user!.email!,
    amount: totalAmount * 100, // converting to kobo for paystack
    publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  };
  const initializePayment = usePaystackPayment(config);
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          initializePayment(onSuccess, onClose);
        }}
      >
        <p className="section-title">Delivery Info</p>
        <TextField
          required
          label="Address"
          multiline
          rows={4}
          className="input-field"
          margin="dense"
          onChange={(e) => {
            setDeliveryAddress(e.target.value);
          }}
          value={deliveryAddress}
        />
        <TextField
          required
          label="Phone Number"
          type="number"
          className="input-field"
          margin="dense"
          onChange={(e) => {
            setDeliveryPhoneNumber(e.target.value);
          }}
          value={deliveryPhoneNumber}
        />

        <p className="section-title">Delivery Method</p>
        <Card>
          <div>
            <span style={{ fontWeight: 600, fontSize: "1.2rem" }}>
              Door Delivery
            </span>
            <div>
              Deliverd between Thursday 3 Nov and Monday 7 Nov for{" "}
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
        </Card>
      </form>
    </Wrapper>
  );
};

export default CheckoutPage;
