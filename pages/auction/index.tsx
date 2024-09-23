import { useUser } from "@auth0/nextjs-auth0";
import { BidList } from "../../components/bid/bidList";
import { BidCard } from "../../components/bid/bidcard";
import { useRouter } from "next/router";
import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";

const AuctionPage = () => {
    const { user } = useUser();
    const router = useRouter()
  return (
    <div className="w-full h-[100dvh] flex items-center justify-center bg-gray-50">
      <div className="fixed top-0 text-2xl w-full flex justify-center items-center font-bold h-[60px] border-b-[1px] border-[#00000023] bg-white">
        <div className="absolute left-2 top-1/2 -translate-y-1/2" onClick={()=>{router.back()}}>
          <ArrowBackRounded />
        </div>
        Auction
      </div>
      <div className="w-full h-full max-w-md flex flex-col items-center px-4">
        <div className="w-full flex items-center flex-col mt-24">
          {/* Only show the BidCard if the user is signed in */}
          {user?.email ? (
            <BidCard userEmail={user.email} />
          ) : (
            <div className="mt-4 text-gray-500">
              Please <button className="px-2 py-[2px] rounded-md border text-gray-400" onClick={()=>{router.push('/api/auth/login')}}>sign in</button> to place a bid.
            </div>
          )}
          <div className="mt-7 w-full h-auto max-h-[calc(100dvh-350px)]">
            <BidList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionPage;
