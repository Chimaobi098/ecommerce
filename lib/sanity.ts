import { createClient } from "next-sanity";
import createImageUrlBuilder from "@sanity/image-url";


export const config = {
  projectId: "lm1r956o",
  dataset: "production",
  apiVersion: "2021-03-25",
  useCdn: true,
  token: 'sk2BmT04Uq2Hxow9cp8iDzDg76gBulpZkAq3CHqfSOgTpxFma2BN4vmnzwbCPhaVedOdUdUYJtyAjEGVbEteDPLmPZoxa2GgoapX7bBDjLHlXiPklLfT1oYPrw0lYHArhKEQVNMHS0cpJCIs7mkTAfHDkYiFMZCO4s3UbciudbSIqvKnZ1lT',
};

export const sanityClient = createClient(config);


export const urlFor = (source:{ asset: { _ref: string; _type: string; }; }) => createImageUrlBuilder(config).image(source);
