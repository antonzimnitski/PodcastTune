import React from "react";
import { Session } from "meteor/session";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

import Loader from "./Loader";
import ModalItem from "./ModalItem";

import doSearch from "./../../queries/doSearch";

const SearchResults = ({ loading, error, searchPreviews }) => {
  if (loading) return <Loader />;
  if (error) {
    return <div>Sorry! There was an error loading search results.</div>;
  }

  return <div className="modal__list">{renderResults(searchPreviews)}</div>;
};

function renderResults(results) {
  if (!results) return <div>Nothing was found</div>;
  return results.map(result => {
    return (
      <Link
        className="modal__item"
        onClick={() => closeSearchModal()}
        key={result.podcastId}
        to={`/podcasts/${result.podcastId}`}
      >
        <ModalItem item={result} />
      </Link>
    );
  });
}

function closeSearchModal() {
  Session.set("isSearchModelOpen", false);
}

export default graphql(doSearch, {
  props: ({ data: { loading, error, searchPreviews } }) => ({
    loading,
    error,
    searchPreviews
  }),
  options: props => {
    return {
      variables: {
        searchTerm: props.searchTerm
      }
    };
  }
})(SearchResults);
