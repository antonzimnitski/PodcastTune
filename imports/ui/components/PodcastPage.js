import React, { Component } from "react";
import moment from "moment";
import { graphql } from "react-apollo";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";
import fetchPodcast from "./../queries/fetchPodcast";

class PodcastPage extends Component {
  renderPodcast() {
    const { podcast } = this.props.data;
    console.log(podcast);
    return (
      <div className="podcast">
        <div className="podcast__header">
          <div>
            <img
              className="podcast__image"
              src={podcast.artwork}
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
            <p className="podcast__description">
              {podcast.description || podcast.summary}
            </p>
          </div>
        </div>

        <ul>
          {podcast.episodes.map(episode => {
            if (!episode) return;
            const unixTime = moment(episode.pubDate).unix();

            return (
              <li key={unixTime}>
                <div>{episode.title}</div>
                <div>{episode.pubDate}</div>
                <div>{episode.mediaUrl}</div>
                <div>{episode.description}</div>
                <div>{episode.linkToEpisode}</div>
              </li>
            );
          })}
        </ul>
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
