import React from "react";
import VendorPage from "../../components/vendorPage/vendorPage.jsx";
import { sanityClient } from "../../lib/sanity.js";
const vendorInfoQuery = `*[_type == 'vendor' && _id == $vendorId]{

    logo,
  title,
  'vendorProducts':*[_type == 'product' && references(^._id) ]{
    slug,
    defaultProductVariant,
    title,

  }
}
`;

const Vendor = ({ results }) => {
  console.log(results);
  return <VendorPage vendorData={results[0]} />;
};

export default Vendor;

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { vendorId } = params;
  const results = await sanityClient.fetch(vendorInfoQuery, { vendorId });

  return { props: { results } };
};
