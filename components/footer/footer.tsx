import { Wrapper } from "./footer.styles";
import { useRouter } from "next/router";
import Link from "next/link";

import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import VideogameAssetOutlinedIcon from "@mui/icons-material/VideogameAssetOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AuctionIcon from "../../public/Auction";
import { Apps, AppsOutlined, Gamepad, GamepadOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";

const Footer = () => {
  const { pathname, push, replace } = useRouter();
  const [isVisible, setIsVisible] = useState(true)
  const specialRoutes = [
    '/app-center',
  ]
  useEffect(()=>{
    specialRoutes.forEach((route)=>{
     if(pathname.includes(route)){
      setIsVisible(false)
     } else {
      setIsVisible(true)
     }
    })
  }, [pathname])
  return (
    <Wrapper className={`footer ${isVisible? '': '!hidden'}`}>
      <div className="icon-container">
        <Link passHref href={"/"}>
          {pathname == "/" ? (
            <HomeIcon fontSize="large" style={{ color: "black" }} />
          ) : (
            <HomeOutlinedIcon fontSize="large" style={{ color: "black" }} />
          )}
        </Link>
        <p style={{ fontWeight: pathname == "/" ? 600 : 500 }}>Home</p>
      </div>

      <div className="icon-container">
        <Link passHref href={"/auction"}>
          {pathname == "/auction" ? (
            <AuctionIcon size={35}/>
          ) : (
            <AuctionIcon size={35}/>
          )}
        </Link>
        <p style={{ fontWeight: pathname == "/auction" ? 600 : 500 }}>Auction</p>
      </div>
      
      <div className="icon-container">
        <Link passHref href={"/app-center"}>
          {pathname == "/app-center" ? (
            <Apps fontSize="large" style={{ color: "black" }} />
          ) : (
            <AppsOutlined fontSize="large" style={{ color: "black" }} />
          )}
        </Link>
        <p style={{ fontWeight: pathname == "/app-center" ? 600 : 500 }}>App Center</p>
      </div>

      <div className="icon-container">
        <Link passHref href={"/profile"}>
          {pathname == "/profile" ? (
            <AccountCircleIcon fontSize="large" style={{ color: "black" }} />
          ) : (
            <AccountCircleOutlinedIcon
              fontSize="large"
              style={{ color: "black" }}
            />
          )}
        </Link>
        <p style={{ fontWeight: pathname == "/profile" ? 600 : 500 }}>
          Profile
        </p>
      </div>
    </Wrapper>
  );
};

export default Footer;
