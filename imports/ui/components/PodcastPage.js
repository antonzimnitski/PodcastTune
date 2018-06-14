import React, { Component } from "react";
import { graphql } from "react-apollo";

import InnerHeader from "./InnerHeader";
import Feed from "./Feed";
import Loader from "./helpers/Loader";
import fetchPodcast from "./../queries/fetchPodcast";

class PodcastPage extends Component {
  renderPodcast() {
    const { podcast } = this.props.data;
    return (
      <div className="podcast">
        <div className="podcast__header">
          <div>
            <img
              className="podcast__image"
              src={podcast.artworkUrl}
              alt={`${podcast.title} artwork`}
            />
          </div>
          <div className="podcast__info">
            <h1 className="podcast__title">{podcast.title}</h1>
            <h2>
              <a
                className="podcast__link"
                href={podcast.website}
                target="_blank"
              >
                {podcast.author}
              </a>
            </h2>
            <p
              className="podcast__description"
              dangerouslySetInnerHTML={{
                __html: podcast.description || podcast.summary
              }}
            />
          </div>
        </div>

        <Feed episodes={podcast.episodes} />
      </div>
    );
  }

  render() {
    const content = this.props.data.loading ? <Loader /> : this.renderPodcast();

    return (
      <React.Fragment>
        <InnerHeader />
        {content}
      </React.Fragment>
    );
  }
}

export default graphql(fetchPodcast, {
  options: props => {
    return {
      variables: {
        podcastId: props.match.params.podcastId
      }
    };
  }
})(PodcastPage);
