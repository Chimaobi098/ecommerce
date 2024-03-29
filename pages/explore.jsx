import React, { useState } from "react";
import ExplorePage from "../components/Explore/explorePage";
import { useEffect } from "react";
import algoliasearch from "algoliasearch";
import { NavBar } from "../components/Explore/explorePage.styles";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import ReactModal from "react-modal";

const Explore = () => {
  const searchClient = algoliasearch(
    process.env.ALGOLIA_APP_ID,
    process.env.ALGOLIA_SEARCH_KEY
  );
  const index = searchClient.initIndex("dev_ecommerce");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);


  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  useEffect(() => {
    let ignore = false;
    async function getalgo() {
      if (!ignore && searchQuery !== "") {
        const res = await index.search(searchQuery, {});
        setSearchResults(res);
        console.log(res);
      }
    }
    getalgo();
    return () => {
      ignore = true;
    };
  }, [searchQuery]);

  function showModal() {
    setIsModalVisible(true);
  }

  const hideModal = () => {
    setIsModalVisible(false);
  };

  return (
    <>
    {isModalVisible && (
      <ReactModal
      style={customStyles}
        isOpen={isModalVisible}
        onRequestClose={hideModal}
        contentLabel="Feature Coming Soon"
      >
        <div>
          <p>Feature coming soon</p>
          <button onClick={hideModal}>Close</button>
        </div>
      </ReactModal>
    )}
      {isNavVisible && (  
      <NavBar>
        <div className="px-4 mb-0 flex flex-row items-center justify-between">
          <div className="w-[80%]">
            <input className="py-[0.2rem] px-[2.1rem] text-left"
              placeholder="Search for products"
              type="search"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              value={searchQuery}
            />
          </div>
          <div className="w-auto" onClick={showModal}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </div>
        </div>
      </NavBar>
      )}

      <ExplorePage searchResults={searchResults} searchQuery={searchQuery} setIsNavVisible={setIsNavVisible} />
    </>

    
  );
};

export default Explore;
