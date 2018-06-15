import React from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";
import doSearch from "./../../queries/doSearch";
import Loader from "./Loader";
import ModalItem from "./ModalItem";
import { Session } from "meteor/session";

const SearchResults = props => {
  if (props.data.loading) return <Loader />;
  return (
    <div className="modal__list">
      {renderResults(props.data.searchPreviews)}
    </div>
  );
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
  options: props => {
    return {
      variables: {
        searchTerm: props.searchTerm
      }
    };
  }
})(SearchResults);
