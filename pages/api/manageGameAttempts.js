import { config } from "../../lib/sanity";

const sanity = require("@sanity/client");

const client = sanity(config);

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    origin: "http://127.0.0.1:5500",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  const { productId, numberOfAttempts } = JSON.parse(req.body);

  if (req.method == "POST") {
    const data = await client
      .create({
        _type: "activeGames",
        productToWin: {
          _type: "reference",
          _ref: productId,
        },
        attemptsRemaining: Number(numberOfAttempts),
      }) // Shallow merge
      .catch((err) => {
        console.error("Oh no, the update failed: ", err.message);
        res
          .status(500)
          .json({ message: "sorry but the operation failed somewhere" });
      });

    res.status(200).send({ message: "that worked!!", sessionId: data._id });
  }
}
