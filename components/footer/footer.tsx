import { Wrapper } from "./footer.styles";
import { useRouter } from "next/router";
import Link from "next/link";

const Footer = () => {
  const { pathname, push, replace } = useRouter();

  return (
    <Wrapper>
      <Link passHref href={"/"}>
        <a>
          <img
            style={{
              width: "24px",
              filter:
                pathname === "/"
                  ? "invert(0%) sepia(98%) saturate(9%) hue-rotate(246deg) brightness(105%) contrast(99%)"
                  : "invert(55%) sepia(6%) saturate(4%) hue-rotate(9deg) brightness(108%) contrast(100%)",
            }}
            src="home.svg"
            alt="arcade section"
          />
        </a>
      </Link>
      <Link passHref href={"/arcade"}>
        <a>
          <img
            style={{
              width: "24px",
              filter:
                pathname === "/arcade"
                  ? "invert(0%) sepia(98%) saturate(9%) hue-rotate(246deg) brightness(105%) contrast(99%)"
                  : "invert(55%) sepia(6%) saturate(4%) hue-rotate(9deg) brightness(108%) contrast(100%)",
            }}
            src="arcade.svg"
            alt="arcade section"
          />
        </a>
      </Link>
      <Link passHref href={"/arcade"}>
        <a>
          <img
            style={{
              width: "24px",
              filter:
                pathname === "/arcade"
                  ? "invert(0%) sepia(98%) saturate(9%) hue-rotate(246deg) brightness(105%) contrast(99%)"
                  : "invert(55%) sepia(6%) saturate(4%) hue-rotate(9deg) brightness(108%) contrast(100%)",
            }}
            src="arcade.svg"
            alt="arcade section"
          />
        </a>
      </Link>
      <Link passHref href={"/arcade"}>
        <a>
          <img
            style={{
              width: "24px",
              filter:
                pathname === "/arcade"
                  ? "invert(0%) sepia(98%) saturate(9%) hue-rotate(246deg) brightness(105%) contrast(99%)"
                  : "invert(55%) sepia(6%) saturate(4%) hue-rotate(9deg) brightness(108%) contrast(100%)",
            }}
            src="arcade.svg"
            alt="arcade section"
          />
        </a>
      </Link>
    </Wrapper>
  );
};

export default Footer;
