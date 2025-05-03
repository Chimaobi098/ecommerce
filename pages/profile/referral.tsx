import React from "react";

import useAuth from "../../utils/supabaseClient";
import { ProfileNav, Wrapper } from "../../components/Home/home.styles";
import { useRouter } from "next/router";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const Referral = () => {
  const { referralCode } = useAuth();
  const router = useRouter();

  return (
    <>
      <ProfileNav>
        <div onClick={() => router.back()}>
          <ArrowBackRoundedIcon />
        </div>
        <header>Referrals</header>
      </ProfileNav>
      <Wrapper>
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Share & Earn Rewards
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Refer friends to earn rewards for each successful referral. It's
              our way of saying thanks for spreading the word.
            </p>

            {referralCode && (
              <p className="text-lg  mb-2">
                Share this link:{" "}
                <strong
                  className="block text-lg text-white bg-black px-8 py-3 rounded-md cursor-pointer hover:bg-white hover:text-black transition"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/?ref=${referralCode}`
                    );
                    alert("Referral link copied!");
                  }}
                >
                  {`${window.location.origin}/?ref=${referralCode}`}
                </strong>
              </p>
            )}
          </div>
        </div>{" "}
      </Wrapper>
    </>
  );
};

export default Referral;
