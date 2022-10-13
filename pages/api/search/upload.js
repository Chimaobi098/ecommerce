import algoliasearch from "algoliasearch";
import indexer from "sanity-algolia";
import { sanityClient, urlFor } from "../../../lib/sanity";

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
  'path':slug.current,
  'productImageUrl': defaultProductVariant.images[0]

}`,
      },
    },
    (document) => document
  );

  try {
    sanityClient.fetch(`* [_type == 'product' ][]._id`).then((ids) =>
      sanityAlgolia.webhookSync(sanityClient, {
        ids: { created: ids, updated: [], deleted: [] },
      })
    );
    res.status(200).send("it worked");
    return;
  } catch (err) {
    console.log(err, "it did not work");
    res.status(500).send("something went wrong");
    return;
  }
}
