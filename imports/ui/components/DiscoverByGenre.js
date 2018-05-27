import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";
import fetchPodcastsPreviews from "./../queries/fetchPodcastsPreviews";

class DiscoverByGenre extends Component {
  handleFetchMore() {
    const { data } = this.props;
    data.fetchMore({
      variables: {
        limit: data.podcastsPreviews.length + 10
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return Object.assign({}, prev, {
          podcastsPreviews: fetchMoreResult.podcastsPreviews
        });
      }
    });
  }

  renderPodcasts() {
    return this.props.data.podcastsPreviews.map(podcast => {
      return (
        <div key={podcast.id}>
          <div>{podcast.name}</div>
          <img src={podcast.artworkUrl} alt="" />
          {podcast.summary ? <div>{podcast.summary}</div> : null}
          <Link to={`/podcasts/${podcast.id}`}>To podcast</Link>
        </div>
      );
    });
  }

  render() {
    const content = this.props.data.loading ? (
      <Loader />
    ) : (
      <div>
        {this.renderPodcasts()}
        {/* Itunes API limit is 200 */}
        {this.props.data.podcastsPreviews.length < 191 ? (
          <button
            className="button button--load"
            onClick={() => this.handleFetchMore()}
          >
            Load More Shows
          </button>
        ) : null}
      </div>
    );

    return (
      <React.Fragment>
        <InnerHeader title="Discover" />
        {content}
      </React.Fragment>
    );
  }
}

export default graphql(fetchPodcastsPreviews, {
  options: props => {
    return {
      variables: {
        genreId: props.match.params.genreId,
        limit: 10
      }
    };
  }
})(DiscoverByGenre);
