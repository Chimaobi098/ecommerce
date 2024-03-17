import React, { useState } from "react";
import  Button  from "@mui/material/Button";
import { useRouter } from "next/router";
import style from "./settings.module.css";
import Signout from "../../public/Signoutbtn.png";
import Image from "next/image";
import { ProfileItem, Wrapper } from "../../components/profilePage/profilePage.styles";
import { NavBar } from "../../components/Home/home.styles";
import { AutoStories, Language, ArrowForwardIos, RemoveRedEyeOutlined, FavoriteBorderOutlined, LockOutlined, GroupRemoveOutlined, SendOutlined, DescriptionOutlined, ArrowBackIos } from "@mui/icons-material";

const Settings = () => {

const [loading, setLoading] = useState(false);
const router = useRouter();

const profileList = [
  {
    profileItemName: "Browser Settings",
    profileItemIcon: <Language />,
    // profileUrl: "/profile/my-details",
  },
  {
    profileItemName: "Content Preferences",
    profileItemIcon: <RemoveRedEyeOutlined />
    // profileUrl: "/profile/address",
  },
  {
    profileItemName: "Reading History",
    profileItemIcon: <AutoStories />,
    // profileUrl: "/profile/wallet",
  },
  {
    profileItemName: "Liked Posts",
    profileItemIcon: <FavoriteBorderOutlined />,
    // profileUrl: "/profile/saved-posts",
  },
  {
    profileItemName: "Privacy & Security",
    profileItemIcon: <LockOutlined />,
    // profileUrl: "/profile/saved-posts",
  },
  {
    profileItemName: "Blocked Users",
    profileItemIcon: <GroupRemoveOutlined />,
    // profileUrl: "/profile/saved-posts",
  },
  {
    profileItemName: "Send Feedback",
    profileItemIcon: <SendOutlined />,
    // profileUrl: "/profile/saved-posts",
  },
  {
    profileItemName: "Legal",
    profileItemIcon: <DescriptionOutlined />,
    // profileUrl: "/profile/saved-posts",
  },
  {
    profileItemName: "Sign Out",
    profileItemIcon: <Image className="Image" style={{ marginTop: "6px", }} src={Signout}  width={30} height={30} alt="signout icon" />,
    
  },
  
];

return ( 
  <>
      <NavBar style={{ textAlign: "center", display: "flex", justifyContent: "center", }}>
        <header style={{ width: "100%" }}>Settings</header> 
      </NavBar>

      {loading && (
          <div className="loading-page h-screen top-0 w-screen absolute z-10 bg-white flex justify-center items-center">
            <svg className="animate-spin -ml-1 mr-3 h-16 w-16 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
      )}
      <button
        style={{ position: "absolute", top: '2.5vh', left: '2%', zIndex: 99 }}
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBackIos />
      </button>
      <Wrapper className="mb-16 mt-[9vh]   md:mb-2 h-[83vh]" style={{paddingTop: 0}}>

              {profileList.map((item, i) => (
                <ProfileItem
                  className="cursor-pointer"
                  key={i}
                  onClick={() => {
                    // handleNavigation(item.profileUrl);
                    if(item.profileItemName == 'Sign Out'){
                      setLoading(true); // Show loading while logging out
                      localStorage.removeItem('user')
                      router.replace("/api/auth/logout");
                    }
                  }}
                >
                  <div className="profile-name-container cursor-pointer"
                  style={{color: item.profileItemName=='Sign Out'?'rgb(255, 77, 0)':'black'}}>
                    {item.profileItemIcon}
                    <div>{item.profileItemName}</div>
                  </div>
                  <ArrowForwardIos style={{ color: "grey", fontSize: "16px", }} />
                </ProfileItem>
              ))}


            {/* <div className={style.Wrapper}> 
            <Image className="Image" style={{ marginTop: "6px", }} src={Signout}  width={30} height={30} alt="signout icon" />
            <Button
              style={{  marginRight: "20px"  }}
              className="text-2xl mt-1 normal-case"
              color="error"
              onClick={() => {
                setLoading(true); // Show loading while logging out
                router.replace("/api/auth/logout");
              }}
            >
              Log Out
            </Button>
          </div> */}
      </Wrapper>
  
  </>
  
    );
 };
export default Settings;