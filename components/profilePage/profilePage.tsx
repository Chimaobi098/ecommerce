import React from "react";
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
    {
      profileItemName: "Customer support",
      profileItemIcon: <SupportAgentOutlinedIcon />,
      profileUrl: "/profile/saved-posts",
    },
  ];
  const router = useRouter();
  console.log(user);
  return (
    <Wrapper>
      <header>
        <div id="hi">Hi,</div>
        <div id="user-name">{user.nickname}</div>
      </header>
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
  );
};

export default ProfilePage;
