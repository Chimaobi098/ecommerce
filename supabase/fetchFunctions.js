// fetchFunctions.js
import { supabase } from "../utils/supabaseClient";

// A) Get server time from Postgres
export async function getServerTime() {
  const { data, error } = await supabase.rpc("get_server_time");
  if (error) {
    console.error("Error fetching server time:", error);
    return null;
  }
  console.log("getServerTime hook", data);
  return data; // This should be a UTC timestamp string
}

// B) Get auctions from the "auctions" table
export async function getAuctions() {
  const { data, error } = await supabase.from("fake_auction").select("*");
  if (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
  console.log("getAuction hook ", data[0]);
  return data[0];
}
