import React, { useState, useEffect } from "react";
import { User } from "../../interfaces/interface";
import { useRouter } from "next/router";
import ReferAFriendIcon from "../../public/quality-service.png";
import WishlistIcon from "../../public/wishlist-2.png";
import CustomerSupportIcon from "../../public/ooooooooooooooooooooooooooooooooooo.png";
import MyDetailsIcon from "../../public/person.png";
import AuctionWalletIcon from "../../public/wallet.png";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ProfileItem, Wrapper } from "./profilePage.styles";
import walleticon from "../../public/et_wallet.svg";
import homeUser from "../../public/uit_house-user.svg";
import Image from "next/image";


const ProfilePage = ({ user }: User) => {
  const [loading, setLoading] = useState(false);
  const [support, setSupport] = useState(false);
  const router = useRouter();

  const handleNavigation = (profileUrl: string) => {
    setLoading(true);
    router.push(profileUrl);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(false);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const profileList = [
    {
      profileItemName: "Refer a friend",
      profileItemIcon: (
        <Image src={ReferAFriendIcon} alt="Refer a friend icon" />
      ),
      profileUrl: "/profile/referral",
    },
    {
      profileItemName: "My Details",
      profileItemIcon: <Image src={MyDetailsIcon} />,
      profileUrl: "/profile/my-details",
    },
    {
      profileItemName: "Address book",
      profileItemIcon: <Image src={homeUser} width={0} height={0} />,
      profileUrl: "/profile/address",
    },
    {
      profileItemName: "Auction Wallet",
      profileItemIcon: <Image src={AuctionWalletIcon} />,
      profileUrl: "/profile/game_wallet",
    },
    {
      profileItemName: "Cash Wallet",
      profileItemIcon: <Image src={walleticon} width={0} height={0} />,
      profileUrl: "/profile/wallet",
    },
    {
      profileItemName: "Wishlist",
      profileItemIcon: <Image src={WishlistIcon} />,
      profileUrl: "/profile/saved-posts",
    },
  ];

  const handleClick = () => {
    setSupport(!support);
  };

  return (
    <>
      <Wrapper className="mb-16 md:mb-2">
        {/* Render the loading page if loading is true */}
        {loading && (
          <div className="loading-page h-screen top-0 w-screen absolute z-10 bg-white flex justify-center items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-16 w-16 text-gray-700"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        <header
          style={{
            top: "0px",
            marginBottom: "0px",
            marginTop: "80px",
          }}
        >
          <div id="hi">Hi,</div>
          <div id="user-name">{user.nickname}</div>
        </header>

        <div
          className={`${
            support
              ? "h-screen  top-0 w-screen absolute z-10 backdrop-filter backdrop-blur-sm"
              : ""
          }`}
          onClick={handleClick}
        ></div>

        {profileList.map((item, i) => (
          <ProfileItem
            className="cursor-pointer"
            key={i}
            onClick={() => {
              handleNavigation(item.profileUrl);
            }}
          >
            <div className="profile-name-container cursor-pointer">
              {/* mew item */}
              <div className="icon-wrapper">{item.profileItemIcon}</div>

              {/* {item.profileItemIcon} */}
              <div>{item.profileItemName}</div>
            </div>
            <ArrowForwardIosRoundedIcon
              style={{ color: "grey", fontSize: "16px" }}
            />
          </ProfileItem>
        ))}

        <ProfileItem className="cursor-pointer" onClick={handleClick}>
          <div className="profile-name-container cursor-pointer">
            <div className="icon-wrapper">
              <Image src={CustomerSupportIcon} />
            </div>

            <div>Customer support</div>
          </div>
          <ArrowForwardIosRoundedIcon
            style={{ color: "grey", fontSize: "16px" }}
          />
        </ProfileItem>

        {/* <ProfileItem className="cursor-pointer">
          <Image className="Image" src={Signout}  width={30} height={30} alt="signout icon" />
        <Button
          style={{  marginRight: "250px" }}
          className="text-2xl mt-2 normal-case"
          color="error"
          onClick={() => {
            setLoading(true); // Show loading while logging out
            router.replace("/api/auth/logout");
          }}
        >
          Log Out
        </Button>
        <ArrowForwardIosRoundedIcon style={{ color: "grey", fontSize: "16px", }} />
          </ProfileItem>   */}

        <div
          className={` ${
            support ? "translate-y-0" : "translate-y-full"
          } w-full flex flex-col text-center absolute bottom-0 z-20 bg-white rounded-t-lg gap-y-6 transition-all duration-500 ease-in-out transform-gpu`}
        >
          <div className="text-sm text-gray-500 pt-2 ">Contact Us</div>
          <div className="cursor-pointer">
            <a href="https://wa.link/j8qu3c">Whatsapp</a>
          </div>
          <div className="border-t pt-3 cursor-pointer ">Email</div>
          <div
            className="border-t text-gray-500 mb-20 md:mb-8 pt-3 cursor-pointer "
            onClick={handleClick}
          >
            Cancel
          </div>
        </div>
      </Wrapper>
    </>
  );
};

export default ProfilePage;
