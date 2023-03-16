import { config } from "../../lib/sanity";
import NextCors from "nextjs-cors";

const sanity = require("@sanity/client");

const client = sanity(config);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500/");
  res.setHeader("Access-Control-Allow-Methods", "POST, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  const { method } = req;

  switch (method) {
    case "POST": {
      const { productId, numberOfAttempts } = JSON.parse(req.body);
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
      res.status(201).json(data);
      break;
    }
    case "PUT": {
      // handle PUT request
      const { sessionId } = JSON.parse(req.body);

      const data = await client
        .patch(sessionId)
        .dec({ attemptsRemaining: 1 })
        .catch((err) => {
          res.status(500).json({ message: err });
        });
      console.log(data);
      res.status(200).json({ data });
    }

    default: {
      res.setHeader("Allow", ["POST", "PUT"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
    }
  }
}
