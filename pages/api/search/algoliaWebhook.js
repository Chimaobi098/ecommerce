import algoliasearch from "algoliasearch";
import indexer from "sanity-algolia";
import { sanityClient } from "../../../lib/sanity";

export default async function handler(req, res) {
  // remember to add the secret cuz this shit is hackcable I mean everything is but still. You can't make it easy for them
  console.log(req);
  const algolia = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY
  );

  const algoliaIndex = algolia.initIndex("dev_ecommerce");

  const sanityAlgolia = indexer(
    {
      product: {
        index: algoliaIndex,
        projection: `
        {
  title,
  'price':defaultProductVariant.price,
  'path':slug.current
  'productImageUrl': defaultProductVariant.images[0]
}`,
      },
    },
    (document) => document
  );

  const ids = {
    created: req.body.ids.created.filter((id) => !!id),
    updated: req.body.ids.updated.filter((id) => !!id),
    deleted: req.body.ids.deleted.filter((id) => !!id),
  };

  sanityAlgolia
    .webhookSync(sanityClient, { ids })
    .then(() => {
      res.status(200).send("ok");
    })
    .catch((res) => {
      res.status(500).send("this didnt work");
    });

  return;
}
