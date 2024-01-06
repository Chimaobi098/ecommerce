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

const Footer = () => {
  const { pathname, push, replace } = useRouter();
  console.log(pathname);
  return (
    <Wrapper className="footer">
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
      {/* <div className="icon-container">
        <Link passHref href={"/arcade"}>
          {pathname == "/arcade" ? (
            <VideogameAssetIcon fontSize="large" style={{ color: "black" }} />
          ) : (
            <VideogameAssetOutlinedIcon
              fontSize="large"
              style={{ color: "black" }}
            />
          )}
        </Link>
        <p style={{ fontWeight: pathname == "/arcade" ? 600 : 500 }}>Games</p>
      </div> */}
      <div className="icon-container">
        <Link passHref href={"/explore"}>
          {pathname == "/explore" ? (
            <SearchIcon fontSize="large" style={{ color: "black" }} />
          ) : (
            <SearchOutlinedIcon fontSize="large" style={{ color: "black" }} />
          )}
        </Link>
        <p style={{ fontWeight: pathname == "/explore" ? 600 : 500 }}>Search</p>
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
