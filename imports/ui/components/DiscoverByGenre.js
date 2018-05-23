import React, { Component } from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

import fetchPodcastsPreviews from "./../queries/fetchPodcastsPreviews";

class DiscoverByGenre extends Component {
  renderPodcasts() {
    return this.props.data.podcastsPreviews.map(podcast => {
      return (
        <div key={podcast.id}>
          <div>{podcast.name}</div>
          <img src={podcast.artworkUrl} alt="" />
          <a href={podcast.itunesUrl}>Itunes page</a>
          <div>{podcast.summary}</div>
        </div>
      );
    });
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <div>{this.renderPodcasts()}</div>
      </div>
    );
  }
}

export default graphql(fetchPodcastsPreviews)(DiscoverByGenre);
