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
import { LayoutGrid } from "lucide-react";

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
        <Link passHref href={"/"}>
          <div className="icon-container">
              {pathname == "/" ? (
                <HomeIcon fontSize="large" style={{ color: "black" }} />
              ) : (
                <HomeOutlinedIcon fontSize="large" style={{ color: "black" }} />
              )}
            <p style={{ fontWeight: pathname == "/" ? 600 : 500 }}>Home</p>
          </div>
        </Link>

        <Link passHref href={"/auction"}>
          <div className="icon-container">
              {pathname == "/auction" ? (
                <AuctionIcon size={35}/>
              ) : (
                <AuctionIcon size={35}/>
              )}
            <p style={{ fontWeight: pathname == "/auction" ? 600 : 500 }}>Auction</p>
          </div>
        </Link>
      
        <Link passHref href={"/app-center"}>
          <div className="icon-container">
              {pathname == "/app-center" ? (
                <LayoutGrid fill="#FFF" strokeWidth={0}/>
              ) : (
                <LayoutGrid/>
              )}
            <p style={{ fontWeight: pathname == "/app-center" ? 600 : 500 }}>App Center</p>
          </div>
        </Link>

        <Link passHref href={"/profile"}>
          <div className="icon-container">
              {pathname == "/profile" ? (
                <AccountCircleIcon fontSize="large" style={{ color: "black" }} />
              ) : (
                <AccountCircleOutlinedIcon
                  fontSize="large"
                  style={{ color: "black" }}
                />
              )}
            <p style={{ fontWeight: pathname == "/profile" ? 600 : 500 }}>
              Profile
            </p>
          </div>
        </Link>
    </Wrapper>
  );
};

export default Footer;
