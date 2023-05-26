import React, { useState } from "react";
import { User } from "../../interfaces/interface";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ProfileItem, Wrapper } from "./profilePage.styles";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
const ProfilePage = ({ user }: User) => {
  const [support, setSupport] = useState(false)

  const handleClick = () =>{
    setSupport(!support)
  }
  const profileList = [
    {
      profileItemName: "My Details",
      profileItemIcon: <FolderSharedOutlinedIcon />,
      profileUrl: "/profile/my-details",
    },
    {
      profileItemName: "Address book",
      profileItemIcon: <HouseOutlinedIcon />,
      profileUrl: "/profile/address",
    },   
     {
      profileItemName: "Wallet",
      profileItemIcon: <AccountBalanceWalletOutlinedIcon />,
      profileUrl: "/profile/wallet",
    },
    {
      profileItemName: "Saved Items",
      profileItemIcon: <ShoppingBagOutlinedIcon />,
      profileUrl: "/profile/saved-posts",
    },
    {
      profileItemName: "Membership plans",
      profileItemIcon: <DateRangeOutlinedIcon />,
      profileUrl: "/profile/membership",
    },
  ];
  const router = useRouter();
  // console.log(user);
  return (
    <>
    <Wrapper className="mt-8 ">
      <header>
        <div id="hi">Hi,</div>
        <div id="user-name">{user.nickname}</div>
      </header>
      <div className={`${support ? 'h-screen top-0 w-screen absolute z-10 backdrop-filter backdrop-blur-sm' : ''}`}></div>

      {profileList.map((item, i) => (
        <ProfileItem
        className="cursor-pointer"
          key={i}
          onClick={() => {
            router.push(`${item.profileUrl}`);
          }}
        >
          <div className="profile-name-container cursor-pointer">
            {item.profileItemIcon}
            <div>{item.profileItemName}</div>
          </div>
          <ArrowForwardIosRoundedIcon />
        </ProfileItem>
      ))}
              <ProfileItem
        className="cursor-pointer"
        onClick={handleClick}
        
        >
          <div className="profile-name-container cursor-pointer">
          <SupportAgentOutlinedIcon />
            <div>Customer support</div>
          </div>
          <ArrowForwardIosRoundedIcon />
        </ProfileItem>

      <Button
      className="text-2xl mt-2 normal-case"
        color="error"
        onClick={() => {
          router.replace("/api/auth/logout");
        }}
      >
        Log Out
      </Button>


    </Wrapper>
          <div className={` ${support ? 'translate-y-0' : 'translate-y-full'} w-full flex flex-col text-center absolute bottom-0 z-20 bg-white rounded-t-lg gap-y-6  transition-all duration-500 ease-in-out transform-gpu`}>
          <div className="text-sm text-gray-500 pt-2 ">Contact Us</div>
          <div className="cursor-pointer">Whatsapp</div>
          <div className="border-t pt-3 cursor-pointer ">Email</div>
          <div className="border-t text-gray-500 mb-8 pt-3 cursor-pointer " onClick={handleClick}>Cancel</div>
  
        </div>
        </>
  );
};

export default ProfilePage;
