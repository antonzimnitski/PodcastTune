import React from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import doSearch from "./../../queries/doSearch";
import Loader from "./Loader";

const SearchResults = props => {
  if (props.data.loading) return <Loader />;
  console.log(props);
  return <div>{renderResults(props.data.searchPreviews)}</div>;
};

function renderResults(results) {
  if (!results) return <div>Nothing was found</div>;
  return results.map(result => {
    return (
      <div key={result.podcastId}>
        <Link to={`/podcasts/${result.podcastId}`}>
          <img
            src={result.artworkUrl}
            style={{ width: "3rem", height: "3rem" }}
            alt={`${result.title} podcast artwork`}
          />
          <div>
            <div>{result.title}</div>
            <div>{result.author}</div>
          </div>
        </Link>
      </div>
    );
  });
}

export default graphql(doSearch, {
  options: props => {
    return {
      variables: {
        searchTerm: props.searchTerm
      }
    };
  }
})(SearchResults);
