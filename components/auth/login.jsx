import React, { useState } from "react";
import { Wrapper } from "./login.styles";
import logo from "./asset/loginImg.png";
import google from "./asset/google.png";
import facebook from "./asset/facebook.png";
import Image from "next/image";
import Link from "next/link";
import SignUp from "./signup";
import auth0 from "auth0-js";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  var webAuth = new auth0.WebAuth({
    domain: "https://dev-skemr198.us.auth0.com",
    clientID: "cGkoUH2CGJcoGrEGhTPBpdYLOCnhBR7n",
    redirectUri: "http://localhost:3000/",
    responseType: "id_token",
  });
  const [activeTab, setActiveTab] = useState("login");
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    try {
      await webAuth.login({
        responseType: "id_token",
        username: email.value,
        password: password.value,
        realm: "Username-Password-Authentication",
      });

    } catch (error) {
      console.error(error);
    }
  };

  const googleAuth = async () => {
    // Trigger login with google
    webAuth.authorize({
      connection: "google-oauth2",
    });
  };
  return (
    <div className="p-2">
      <Link passHref href={"/"}>
        <p className="cursor-pointer font-bold text-2xl">X</p>
      </Link>

      <div className="flex items-center justify-center ">
        <Image src={logo} alt="Ecommere Logo" width={96} height={96} />
      </div>
      <section className="main">
        <div className="form_wrapper">
          <Wrapper>
            <div className="title flex mt-4 mb-8 justify-around text-xl">
              <h3
                className={
                  activeTab === "login" ? "tabStyle" : "cursor-pointer"
                }
                onClick={() => handleTabChange("login")}
              >
                LOG IN
              </h3>

              <h3
                className={
                  activeTab === "signup" ? "tabStyle" : "cursor-pointer"
                }
                onClick={() => handleTabChange("signup")}
              >
                SIGN UP
              </h3>
            </div>
          </Wrapper>
          {activeTab === "login" && (
            <form className="w-full" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="E-mail"
                name="email"
                className="p-2 mb-4  bg-transparent w-full border-b-2 border-gray-400 focus:border-gray-400 focus:outline-none focus:border-b-2 "
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="p-2 mb-4  bg-transparent w-full border-b-2 border-gray-400 focus:border-gray-400 focus:outline-none focus:border-b-2 "
              />
              <div className="flex justify-between text-gray-400">
                <div>
                  <input type="checkbox" name="remember" id="" />
                  <label htmlFor="remember">Remember</label>
                </div>
                <p>Forgot Password?</p>
              </div>
              <button className="w-full mt-12 mb-12 bg-black text-white text-lg p-2 text-center">
                Log In
              </button>
              <div className="flex justify-center items-center">
                <span className="flex-1 h-[2px] bg-[#E4E9EE]"></span>
                <p className="text-[12px] mr-4 ml-4">Log in with</p>
                <span className="flex-1 h-[2px] bg-[#E4E9EE]"></span>
              </div>
              <div className="flex justify-center gap-4 mt-4 mb-2">
                <Image
                  src={google}
                  alt="Ecommere Logo"
                  width={32}
                  height={32}
                  onClick={googleAuth}
                  className="cursor-pointer"
                />
                <Image
                  src={facebook}
                  alt="Ecommere Logo"
                  width={48}
                  height={48}
                  className="cursor-pointer"
                />
              </div>
              <p className="text-center text-[12px] mt-4">
                By continuing to use this app, you agree to CUPSHE’s Terms of
                Service and Privacy Policy
              </p>
            </form>
          )}
          {activeTab === "signup" && <SignUp />}
        </div>
      </section>
    </div>
  );
};

export default Login;
