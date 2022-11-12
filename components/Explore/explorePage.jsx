import React from "react";
import { NavBar, SearchResultItems, Wrapper } from "./explorePage.styles";
import { urlFor } from "../../lib/sanity";
import { formatCurrency } from "../../utils/currencyFormatter.ts";
import Link from "next/link";

const ExplorePage = ({ searchResults }) => {
  console.log(searchResults);
  return (
    <Wrapper>
      {searchResults?.hits?.map((searchResult) => (
        <Link
          href={`/product/${searchResult.path}`}
          passHref
          key={searchResult._id}
        >
          <SearchResultItems whileTap={{ scale: 0.9 }}>
            <img src={urlFor(searchResult.productImageUrl)} />
            <div id="product-info">
              <h4>{searchResult.title}</h4>
              <h3>{formatCurrency(searchResult.price)}</h3>
            </div>
          </SearchResultItems>
        </Link>
      ))}
    </Wrapper>
  );
};

export default ExplorePage;
