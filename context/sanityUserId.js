import React from "react";
import { createContext } from "react";
import { useUser } from "@auth0/nextjs-auth0/dist/frontend/use-user";
import { useState, useEffect, useContext } from "react";
import { sanityClient } from "../lib/sanity";

const SanityUIDContext = createContext("");
export const useSanityUIDContext = () => useContext(SanityUIDContext);

export const SanityUIDProvider = ({ children }) => {
  const [sanityUID, setSanityUID] = useState("");
  const { user, error } = useUser();

  useEffect(() => {
    async function getSanityUID() {
      if (user) {
        let userId = await sanityClient.fetch(
          `
*[_type == 'users' && userId ==$auth0ID]{
  _id,
}`,
          {
            auth0ID: user?.sub,
          }
        );
        console.log(user);
        setSanityUID(userId[0]?._id);
      }
    }
    getSanityUID();
  }, [user]);

  return (
    <SanityUIDContext.Provider value={sanityUID}>
      {children}
    </SanityUIDContext.Provider>
  );
};
