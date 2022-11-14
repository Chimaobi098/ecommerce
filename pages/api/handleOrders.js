import { config } from "../../lib/sanity";
const sanity = require("@sanity/client");

const client = sanity(config);

export default async function handler(req, res) {
 let sanityInfo= JSON.parse(
    req.body
  );
  const data = await client
      .create({
          _type: 'orders',
        ...sanityInfo,
      paidAt: new Date().toISOString(),
    }) // Shallow merge
    .catch((err) => {
      console.error("Oh no, the update failed: ", err.message);
      res.status(500);
    });
  console.log(data);

  res.status(200).send({message:"that worked!!"});
}
