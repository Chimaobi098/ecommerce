import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePaystackPayment } from "react-paystack";
import { CloseOutlined } from "@mui/icons-material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import {
  StoreCard,
  TransactionHistoryWrapper,
  Wrapper,
} from "./walletPage.styles";
import { useRouter } from "next/router";
import { sanityClient } from "../../../lib/sanity";

const WalletPage: React.FC = () => {
  const router = useRouter();
  const { user, error } = useUser();
  const [userId, setUserId] = useState<string>("");
  const [walletDeposit, setWalletDeposit] = useState("");
  const [amount, setAmount] = useState<string>("0.00");
  console.log(user);
  

  const [depositList, setDepositList] = useState<boolean>(false);
  const [accountdetails, setAccountdetails] = useState<boolean>(false);
  const [carddetails, setcarddetails] = useState<boolean>(false);

  const [copied, setCopied] = useState<boolean>(false);

  const handleDeposit = () => {
    setDepositList(!depositList);
  };

  const handleAccount = () => {
    setAccountdetails(!accountdetails);
  };

  const handleCard = () => {
    setcarddetails(!carddetails);
  };

  const handleCopyClick = () => {
    const contentToCopy = document.getElementById('contentToCopy');
    if (contentToCopy) {
      const textToCopy = contentToCopy.innerText;

      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(error => {
          console.error('Error copying text:', error);
        });
    }
  };

  useEffect(() => {
    const getUID = async () => {
      const data = await sanityClient.fetch<{ _id: string }[]>(
        `
        *[_type == 'users' && email == $auth0ID]{
          _id,
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
            walletAmount
            
    }`,
      { curr: user?.email }
      );
      
  setWalletDeposit(results[0]?.walletAmount);
  console.log(results);
  
  
    }
    getDetails();
  },[user]);

  const config = {
    email: user?.email!,
    amount: Number(amount) * 100,
    publicKey: process.env.PAYSTACK_PUBLIC_KEY!,
  };
  const initializePayment = usePaystackPayment(config);

  const onSuccess = () => {
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
        } else {
          alert("Money was successfully added. Thank you!!!");
          window.location.reload();
        }
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
      <div className="flex flex-col items-center justify-center text-2xl py-12 gap-y-2">
        {/* <div className="flex flex-row items-center">
          <VisibilityOutlinedIcon />
          <h2 className="text-2xl mx-2">Total Balance:</h2>
          </div> */}
          <div className="text-3xl md:text-4xl font-medium">
          ₦{walletDeposit}
          </div>
          <h4 className="text-gray-500 text-sm">Available</h4>
           </div>

           <div className={`${depositList ? 'h-screen top-0 left-0 absolute w-[457px] z-10 bg-black opacity-60' : ''}`} onClick={handleDeposit}></div>

           <div className="flex flex-row justify-between gap-x-4 mb-12">
            <div className="w-2/4">
              <div onClick={handleDeposit}><button className="w-full bg-black text-white h-12 rounded-md">Deposit</button></div>
            </div>
            <div className="w-2/4">
            <Link href='/profile/wallet/withdraw'><button className="w-full bg-white text-black h-12 border border-black rounded-md">Withdraw</button></Link>

            </div>


           </div>

      <TransactionHistoryWrapper>
        This is your transaction history
      </TransactionHistoryWrapper>
      <div className={` ${depositList ? 'translate-y-0' : 'translate-y-full'} w-full left-0 flex flex-col text-center absolute bottom-0 z-20 bg-white rounded-t-lg gap-y-6 px-4 pb-12 transition-all duration-500 ease-in-out transform-gpu`} >
          <div className="flex flex-row justify-between items-end ">
            <div className="mt-8 text-2xl font-medium">Select deposit method</div>
            <div><CloseOutlined onClick={handleDeposit} className="text-2xl mb-2 cursor-pointer"/></div>
            </div>
          

            <div className="flex flex-col border p-4 text-left cursor-pointer shadow-md" onClick={handleCard}>
            <div className="font-medium">Card</div>
            <div className="text-gray-400">Fund your account using debit/credit card</div>
            </div>
            

            <div className="flex flex-col border p-4 text-left cursor-pointer shadow-md" onClick={handleAccount}>
            <div className="font-medium">Bank Transfer</div>
            <div className="text-gray-400" >Fund your account using bank app</div>
            </div>

          
  
        </div>

        

          
        <div className={` ${accountdetails ? 'translate-y-0' : 'translate-y-full'} w-full left-0 flex flex-col text-center absolute bottom-0 z-20 bg-white rounded-t-lg gap-y-6 px-4 pb-12 transition-all duration-500 ease-in-out transform-gpu`} >
          <div className="flex flex-row justify-between items-end ">
            <div className="mt-8 text-2xl font-medium">Account details</div>
            <div><CloseOutlined onClick={handleAccount} className="text-2xl mb-2 cursor-pointer"/></div>
            </div>
            <div className="text-left font-medium">Make payment into the account below</div>
          <div className="flex flex-col border p-4 text-left cursor-pointer shadow-md">
            <div className="font-medium">Account Name</div>
            <div className="text-gray-400">Ogbonna Chimaobi</div>
            </div>

            <div className="flex flex-row border p-4 text-left items-center justify-between cursor-pointer shadow-md">
              <div className="flex flex-col text-left">
            <div className="font-medium">Account Number</div>
            <div className="text-gray-400" id="contentToCopy">617 XXX 8052</div>
             </div>

             <div className="text-gray-700" onClick={handleCopyClick}><ContentCopyIcon />
             {copied ? 'Copied!' : ''}</div>
            </div>

            <div className="flex flex-col border p-4 text-left cursor-pointer shadow-md">
            <div className="font-medium">Bank Name</div>
            <div className="text-gray-400">Fidelity bank</div>
            </div>

          
  
        </div>

        <div className={` ${carddetails ? 'translate-y-0' : 'translate-y-full'} w-full left-0 flex flex-col text-center absolute bottom-0 z-20 bg-white rounded-t-lg gap-y-6 px-4 pb-12 transition-all duration-500 ease-in-out transform-gpu`} >
          <div className="flex flex-row justify-between items-end ">
            <div className="mt-8 text-2xl font-medium">Input Top Up Amount</div>
            <div><CloseOutlined onClick={handleCard} className="text-2xl mb-2 cursor-pointer"/></div>
            </div>
          <div className="flex flex-col text-left w-full">
          <form
          className=""
        onSubmit={(e) => {
          e.preventDefault();
          initializePayment(onSuccess, onClose);
        }}
      >
          <input type='number' placeholder='Amount (NGN)' className='h-16 w-full pl-4 placeholder-gray-800 border border-gray-800 text-lg my-8'
          onChange={(e) => {
            setAmount(e.target.value)
          }}
          />
            
          <button type="submit" className='w-full h-16 text-white bg-black rounded-md'>Top Up Now</button>

          </form>
            </div>

          
  
        </div>

        
    </Wrapper>
  );
};

export default WalletPage;
