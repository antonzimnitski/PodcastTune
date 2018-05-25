import React, { Component } from "react";
import moment from "moment";
import { graphql } from "react-apollo";

import fetchPodcast from "./../queries/fetchPodcast";

class PodcastPage extends Component {
  renderPodcast() {
    const { podcast } = this.props.data;
    return (
      <div>
        <p>{podcast.title}</p>
        <p>{podcast.summary}</p>
        <p>{podcast.image}</p>
        <p>{podcast.link}</p>
        <p>{podcast.author}</p>
        <ul>
          {podcast.feed.map(episode => {
            const unixTime = moment(episode.pubDate).unix();

            return (
              <li key={unixTime}>
                <div>{episode.title}</div>
                <div>{episode.pubDate}</div>
                <div>{episode.mediaUrl}</div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }
    return <div>{this.renderPodcast()}</div>;
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
