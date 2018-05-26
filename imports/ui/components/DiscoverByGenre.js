import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";
import fetchPodcastsPreviews from "./../queries/fetchPodcastsPreviews";

class DiscoverByGenre extends Component {
  renderPodcasts() {
    return this.props.data.podcastsPreviews.map(podcast => {
      return (
        <div key={podcast.id}>
          <div>{podcast.name}</div>
          <img src={podcast.artworkUrl} alt="" />
          <a href={podcast.itunesUrl}>Itunes page</a>
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
      <div>{this.renderPodcasts()}</div>
    );

    return (
      <div>
        <InnerHeader title="Discover" />
        {content}
      </div>
    );
  }
}

export default graphql(fetchPodcastsPreviews, {
  options: props => {
    return {
      variables: {
        genreId: props.match.params.genreId
      }
    };
  }
})(DiscoverByGenre);
