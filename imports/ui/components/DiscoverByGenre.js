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
        <Link to={`/podcasts/${podcast.id}`} key={podcast.id}>
          <div className="preview">
            <div>
              <img
                className="preview__image"
                src={podcast.artwork}
                alt={`${podcast.title} - logo`}
              />
            </div>
            <div className="preview__info">
              <div className="preview__title">{podcast.title}</div>
              {podcast.summary ? (
                <div className="preview__description">{podcast.summary}</div>
              ) : null}
            </div>
          </div>
        </Link>
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
        genreId: props.match.params.genreId
      }
    };
  }
})(DiscoverByGenre);
