import React, { useEffect, useRef, useState } from "react";
import { NavBar, SearchResultItems, Wrapper } from "./explorePage.styles";
import { urlFor } from "../../lib/sanity";
import { formatCurrency } from "../../utils/currencyFormatter.ts";
import Link from "next/link";
import { sanityClient } from "../../lib/sanity";
import SearchByCategory from "./searchByCategory";
import { buildTree } from "../../utils/buildtree";

const ExplorePage = ({ searchResults, searchQuery, setIsNavVisible }) => {
  const [categoryData, setCategoryData] = useState();
  const tree = useRef();
  
  useEffect(() => {
    async function getCategories() {
      const results = await sanityClient.fetch(`*[_type == 'category' ]{
  title,
  children[]->{
    title,
    children 
  },isRootCategory
}`);
      setCategoryData(results);
      tree.current = buildTree(results);
    }
    getCategories();
  }, []);

  console.log(categoryData);
  return (
    <Wrapper>
      {searchResults.length == 0 || !searchQuery ? (
        <SearchByCategory setIsNavVisible={setIsNavVisible} categoryData={tree.current} searchQuery={searchQuery}  />
      ) : (
        searchResults?.hits?.map((searchResult) => (
          <Link
            href={`/product/${searchResult.path}`}
            passHref
            key={searchResult._id}
          >
            <SearchResultItems  whileTap={{ scale: 0.9 }}>
              <img  src={urlFor(searchResult.productImageUrl)} />
              <div id="product-info">
                <div><h1>Products</h1></div>
                <h4>{searchResult.title}</h4>
                <h3>{formatCurrency(searchResult.price)}</h3>
              </div>
            </SearchResultItems>
          </Link>
        ))
      )}
    </Wrapper>
  );
};

export default ExplorePage;
