import algoliasearch from "algoliasearch";
import indexer from "sanity-algolia";
import { sanityClient } from "../../../lib/sanity";

export default async function handler(req, res) {
  // remember to add the secret cuz this shit is hackcable I mean everything is but still. You can't make it easy for them
  //This end point which is triggered by sanity instead of manually shows a success message but doesn't do anything!!!
  console.log(req.body);
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

  const ids = {
    created: req.body.ids.created.filter((id) => !!id),
    updated: req.body.ids.updated.filter((id) => !!id),
    deleted: req.body.ids.deleted.filter((id) => !!id),
  };
  console.log(ids);

  try {
    await sanityAlgolia.webhookSync(sanityClient, { ids });
    res.status(200).send("ok");
    return;
  } catch (err) {
    res.status(500).send({ message: err });
    return;
  }
}
