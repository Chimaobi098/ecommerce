import { config } from "../../lib/sanity";
const sanity = require("@sanity/client");

const client = sanity(config);

export default async function handler(req, res) {
  console.log(req.body);
  const { _id, likedProducts, userId, productItemKey } = JSON.parse(req.body);

  let userDoc = await client.getDocument(userId);

  // check if product id is already in liked products array

  let likeState = userDoc.likedProducts.find((product) => product._ref == _id);

  if (!likeState) {
    try {
      await client
        .patch(userId)
        .setIfMissing({ likedProducts: [] })
        .append("likedProducts", [likedProducts])
        .commit({
          // Adds a `_key` attribute to array items, unique within the array, to
          // ensure it can be addressed uniquely in a real-time collaboration context
          autoGenerateArrayKeys: true,
        });

      let final = await client
        .patch(_id) // Document ID to patch
        .inc({
          likes: 1,
        })
        .commit();
    } catch (err) {
      console.error("Oh no, the update failed: ", err.message);
      res.status(500).json({ message: "Yh, that didnt work bro" });
    }
  } else {
    try {
      await client
        .patch(_id) // Document ID to patch
        .dec({
          likes: 1,
        }) // Shallow merge
        .commit(); // Perform the patch and return a promise

      client
        .patch(userId)
        .unset([`likedProducts[_key=="${likeState._key}"]`])
        .commit();
    } catch (err) {
      console.error("Oh no, the update failed: ", err.message);
      res.status(500).json({ message: "Yh, that didnt work" });
    }
  }

  //Add product to liked products in sanity

  res.status(200).send({ message: "that worked!!" });
}
