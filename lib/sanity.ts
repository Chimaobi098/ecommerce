import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";


export const config = {
  projectId: "lm1r956o",
  dataset: "production",
  apiVersion: "2021-03-25",
  useCdn: true,
  token: process.env.NEXT_PUBLIC_SANITY_AUTH_TOKEN
};

export const sanityClient = createClient(config);


export const urlFor = (source:{ asset: { _ref: string; _type: string; }; }) => createImageUrlBuilder(config).image(source);
