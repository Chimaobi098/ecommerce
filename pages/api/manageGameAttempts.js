import { config } from "../../lib/sanity";
import NextCors from "nextjs-cors";

const sanity = require("@sanity/client");

const client = sanity(config);

export default async function handler(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ["PUT", "POST"],
    origin: "http://127.0.0.1:5500",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const { method } = req;

  switch (method) {
    case "POST": {
      console.log(req.body);
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
      console.log(data);
      res.status(201).json(data);
      break;
    }
    case "PUT": {
      // handle PUT request     console.log(req.body, "hello its me this is it");
      const { sessionId } = JSON.parse(req.body);

      const data = await client
        .patch(sessionId)
        .dec({ attemptsRemaining: 1 })
        .commit()
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
