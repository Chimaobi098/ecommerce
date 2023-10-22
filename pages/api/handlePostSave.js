import { config } from "../../lib/sanity";
const sanity = require("@sanity/client");

const client = sanity(config);

export default async function handler(req, res) {
  console.log(req.body);
  const { userId, productId } = JSON.parse(req.body);

  let userDoc = await client.getDocument(userId);

  // check if product id is already in liked products array

  let saveState = userDoc.savedProducts.find(
    (product) => product._ref == productId
  );

  if (saveState) {
    try {
      await client
        .patch(userId)
        .setIfMissing({ savedProducts: [] })
        .append("savedProducts", [productId])
        .commit({
          // Adds a `_key` attribute to array items, unique within the array, to
          // ensure it can be addressed uniquely in a real-time collaboration context
          autoGenerateArrayKeys: true,
        });
    } catch (err) {
      console.error("Oh no, the update failed: ", err.message);
      res.status(500).json({ message: "Yh, that didnt work bro" });
    }
  } else {
    try {
      await client
        .patch(userId)
        .unset([`savedProducts[_key=="${saveState._key}"]`])
        .commit();
    } catch (err) {
      console.error("Oh no, the update failed: ", err.message);
      res.status(500).json({ message: "Yh, that didnt work bro" });
    }
  }

  res.status(200).send({ message: "that worked!!" });
}
