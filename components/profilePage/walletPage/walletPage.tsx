import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePaystackPayment } from "react-paystack";
import { CloseOutlined } from "@mui/icons-material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import dynamic from 'next/dynamic'; // Lazy loading for heavy components

import {
  StoreCard,
  TransactionHistoryWrapper,
  Wrapper,
} from "./walletPage.styles";
import { useRouter } from "next/router";
import { sanityClient } from "../../../lib/sanity";

const WalletPage = () => {
  const router = useRouter();
  const { user, error } = useUser();
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("0.00");
  console.log(user);

  // Consolidate state into a single object
  const [uiState, setUIState] = useState({
    depositList: false,
    accountdetails: false,
    carddetails: false,
    copied: false,
  });

  const handleToggle = (key) => {
    setUIState((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  const handleCopyClick = () => {
    const contentToCopy = document.getElementById('contentToCopy');
    const textToCopy = contentToCopy.innerText;

    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        handleToggle('copied');
        setTimeout(() => handleToggle('copied'), 2000);
      })
      .catch(error => {
        console.error('Error copying text:', error);
      });
  };

  useEffect(() => {
    const getUID = async () => {
      const data = await sanityClient.fetch(`
        *[_type == 'users' && email == $auth0ID]{
          _id,
          name,
          phoneNumber,
          address
        }`, { auth0ID: user?.email });

      setUserId(data);
    };

    getUID();
  }, [user]);

  const config = {
    email: user?.email!,
    amount: Number(amount) * 100,
    publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  };
  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
    console.log(amount);
    alert("Your payment was successful");
    fetch("/api/addToWallet", {
      method: "POST",
      body: JSON.stringify({
        amount: Number(amount),
        _id: userId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          alert("Could not add to the wallet. Please contact dev");
          router.push("/profile/wallet");
          return;
        }

        alert("Money was successfully added. Thank you!!!");
      })
      .catch((err) => {
        console.log(err, "This didn't");
      });
  };

  const onClose = () => {
    alert("Don't leave; just try again 🥺👉👈");
  };

  return (
    <Wrapper className="mt-20 mx-4">
      {/* Your component content goes here */}
    </Wrapper>
  );
};

export default WalletPage;
