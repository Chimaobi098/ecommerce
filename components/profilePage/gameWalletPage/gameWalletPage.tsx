import { useUser } from "@auth0/nextjs-auth0";
import { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Wrapper } from "./walletPage.styles";
import { useRouter } from "next/router";
import useAppAuth, { FbUser } from "../../../utils/firebase";

const WalletPage: React.FC = () => {
  const router = useRouter();
  // const { user, error } = useUser();
  const {
    getUserFromLocalStorage,
  } = useAppAuth();
  const user = getUserFromLocalStorage();
  const [userDetails, setUserDetails] = useState<FbUser | null>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    if(user){
      setUserDetails(JSON.parse(user));
    }
  }, [])

  return (
    <Wrapper className="mt-20 mx-4">
      <div className="flex flex-col items-center justify-center text-2xl py-12 gap-y-2">
        <div className="text-3xl md:text-4xl font-medium">
          ₦{userDetails?.gameWalletBalance}
        </div>
        <h4 className="text-gray-500 text-sm">Available</h4>
      </div>

      {/* <TransactionHistoryWrapper>
        This is your transaction history
      </TransactionHistoryWrapper> */}
      
    </Wrapper>
  );
};

export default WalletPage;
