import { Wrapper } from "./footer.styles";
import { useRouter } from "next/router";
import Link from "next/link";

import HomeIcon from "@mui/icons-material/Home";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import VideogameAssetOutlinedIcon from "@mui/icons-material/VideogameAssetOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SearchIcon from "@mui/icons-material/Search";

const Footer = () => {
  const { pathname, push, replace } = useRouter();
  console.log(pathname);
  return (
    <Wrapper>
      <Link passHref href={"/"}>
        <a>
          {pathname == "/" ? (
            <HomeIcon fontSize="large" style={{ color: "black" }} />
          ) : (
            <HomeOutlinedIcon fontSize="large" style={{ color: "black" }} />
          )}
        </a>
      </Link>
      <Link passHref href={"/arcade"}>
        <a>
          {pathname == "/arcade" ? (
            <VideogameAssetIcon fontSize="large" style={{ color: "black" }} />
          ) : (
            <VideogameAssetOutlinedIcon
              fontSize="large"
              style={{ color: "black" }}
            />
          )}
        </a>
      </Link>
      <Link passHref href={"/explore"}>
        <a>
          {pathname == "/explore" ? (
            <SearchIcon fontSize="large" style={{ color: "black" }} />
          ) : (
            <SearchOutlinedIcon fontSize="large" style={{ color: "black" }} />
          )}
        </a>
      </Link>
    </Wrapper>
  );
};

export default Footer;
