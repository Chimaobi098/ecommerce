import React from "react";
import google from "./asset/google.png";
import facebook from "./asset/facebook.png";
import Image from "next/image";

const SignUp = () => {
  return (
    <form className="w-full">
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

      <button className="w-full mt-12 mb-12 bg-black text-white text-lg p-2 text-center">
        SignUp
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
        By continuing to use this app, you agree to CUPSHE’s Terms of Service
        and Privacy Policy
      </p>
    </form>
  );
};

export default SignUp;
