import { config } from "../../lib/sanity";
const sanity = require("@sanity/client");

const client = sanity(config);

export default async function handler(req, res) {
  console.log(req.body);
  const { _id, likeState, likedProducts, userId, productItemKey } = JSON.parse(
    req.body
  );
  console.log(likeState, "this is the like state");
  if (likeState) {
    client
      .patch(_id) // Document ID to patch
      .inc({
        likes: 1,
      }) // Shallow merge
      .commit() // Perform the patch and return a promise
      .catch((err) => {
        console.error("Oh no, the update failed: ", err.message);
        res.status(500).json({ message: "Yh, that didnt work bro" });
      });

    client
      .patch(userId)
      .append("likedProducts", [likedProducts])
      .commit({
        // Adds a `_key` attribute to array items, unique within the array, to
        // ensure it can be addressed uniquely in a real-time collaboration context
        autoGenerateArrayKeys: true,
      })
      .catch((err) => {
        console.error("Oh no, the update failed: ", err.message);
        res.status(500).json({ message: "Yh, that didnt work bro" });
      });
  } else {
    client
      .patch(_id) // Document ID to patch
      .dec({
        likes: 1,
      }) // Shallow merge
      .commit() // Perform the patch and return a promise
      .catch((err) => {
        console.error("Oh no, the update failed: ", err.message);
        res.status(500).json({ message: "Yh, that didnt work bro" });
      });

    client
      .patch(userId)
      .unset([`likedProducts[_key=="${productItemKey}"]`])
      .commit();
  }

  //Add product to liked products in sanity

  res.status(200).send({ message: "that worked!!" });
}
