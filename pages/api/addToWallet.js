import { config } from "../../lib/sanity";
const sanity = require("@sanity/client");

const client = sanity(config);

export default async function handler(req, res) {
  console.log(req.body);
  const { _id, amount } = JSON.parse(req.body);

  console.log(typeof amount);

  try {
    await client
      .patch(_id) // Document ID to patch
      .inc({
        walletAmount: amount,
      }) // Shallow merge
      .commit(); // Perform the patch and return a promise

    res.status(200).send({ message: "that worked!!" });
  } catch (err) {
    console.error("Oh no, the update failed: ", err.message);
    res.status(500).json({ message: "Yh, that didn't work bro" });
  }
}
