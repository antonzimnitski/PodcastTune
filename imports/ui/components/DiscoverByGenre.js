import React, { Component } from "react";
import { Link } from "react-router-dom";
import { graphql } from "react-apollo";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";
import fetchPodcastsPreviews from "./../queries/fetchPodcastsPreviews";

class DiscoverByGenre extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 10
    };
  }

  renderPodcasts() {
    return this.props.data.podcastsPreviews.map((podcast, index) => {
      if (index >= this.state.limit) return;
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
      <React.Fragment>
        <div className="preview-list">{this.renderPodcasts()}</div>
        {this.state.limit <= this.props.data.podcastsPreviews.length - 1 ? (
          <button
            className="button button--load"
            onClick={() => this.setState({ limit: this.state.limit + 10 })}
          >
            fetch more
          </button>
        ) : null}
      </React.Fragment>
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
