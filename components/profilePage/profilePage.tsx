import React from "react";
import { User } from "../../interfaces/interface";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { ProfileItem, Wrapper } from "./profilePage.styles";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import Button from "@mui/material/Button";
import { useRouter } from "next/router";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
const ProfilePage = ({ user }: User) => {
  const profileList = [
    {
      profileItemName: "Orders",
      profileItemIcon: <ShoppingBagOutlinedIcon />,
      profileUrl: "/profile/orders",
    },
    {
      profileItemName: "Wallet",
      profileItemIcon: <AccountBalanceWalletOutlinedIcon />,
      profileUrl: "/profile/wallet",
    },
    {
      profileItemName: "Recently Viewed",
      profileItemIcon: <RemoveRedEyeOutlinedIcon />,
      profileUrl: "/profile/recently-viewed",
    },
    {
      profileItemName: "Rating & Reviews",
      profileItemIcon: <StarBorderRoundedIcon />,
      profileUrl: "/profile/ratings-and-reviews",
    },
    {
      profileItemName: "My Details",
      profileItemIcon: <FolderSharedOutlinedIcon />,
      profileUrl: "/profile/my-details",
    },
    {
      profileItemName: "Liked Products",
      profileItemIcon: <FavoriteBorderOutlinedIcon />,
      profileUrl: "/profile/liked-products",
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
          key={i}
          onClick={() => {
            router.push(`${item.profileUrl}`);
          }}
        >
          <div className="profile-name-container">
            {item.profileItemIcon}
            <div>{item.profileItemName}</div>
          </div>
          <ArrowForwardIosRoundedIcon />
        </ProfileItem>
      ))}

      <Button
        variant="contained"
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
