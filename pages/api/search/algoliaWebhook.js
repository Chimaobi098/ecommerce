import algoliasearch from "algoliasearch";
import indexer from "sanity-algolia";
import { sanityClient } from "../../../lib/sanity";

export default async function handler(req, res) {
  // remember to add the secret cuz this shit is hackcable I mean everything is but still. You can't make it easy for them

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

  return sanityAlgolia
    .webhookSync(sanityClient, req.body)
    .then(() => res.status(200).send("ok"));
}
