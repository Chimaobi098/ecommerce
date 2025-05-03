import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export default function useAuth() {
  const { user, error, isLoading } = useUser();
  const [referralCode, setReferralCode] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function checkUser() {
      console.log("supabase client", user); //remove in productiion

      const auth0_id = user.sub; // Auth0 user ID
      const { data, error } = await supabase
        .from("referrals")
        .select("referral_code")
        .eq("auth0_id", auth0_id)
        .maybeSingle(); // Avoids errors when no row exists

      if (data) {
        setReferralCode(data.referral_code);
      } else {
        // Generate a new referral code
        const newReferralCode = generateReferralCode();
        console.log("your referral code is: ", newReferralCode);
        await supabase.from("referrals").insert([
          {
            auth0_id,
            referral_code: newReferralCode,
            referred_by: getReferredBy(), // Get referral from URL
            email: user.email, // New column storing the user's email
          },
        ]);
        setReferralCode(newReferralCode);
      }
    }

    checkUser();
  }, [user]);

  function generateReferralCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  function getReferredBy() {
    return localStorage.getItem("referredBy");
  }

  return { user, referralCode, error, isLoading };
}
