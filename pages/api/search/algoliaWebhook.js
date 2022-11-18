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
    sanityAlgolia.webhookSync(sanityClient, {
      ids: {
        created: [],
        updated: [],
        deleted: ["35f78f0b-8938-412d-aae0-80937ee4a744"],
      },
    });

    res.status(200).send("it worked");
    return;
  } catch (err) {
    console.log(err, "it did not work");
    res.status(500).send("something went wrong");
    return;
  }
}
