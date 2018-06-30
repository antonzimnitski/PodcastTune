import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import InnerHeader from "./InnerHeader";
import Feed from "./Feed";
import Loader from "./helpers/Loader";

const GET_PODCAST = gql`
  query Podcast($podcastId: Int!) {
    podcast(podcastId: $podcastId) {
      podcastId
      feedUrl
      title
      author
      website
      description
      summary
      artworkUrl
    }
  }
`;

class PodcastPage extends Component {
  renderPodcast() {
    return (
      <Query
        query={GET_PODCAST}
        variables={{
          podcastId: this.props.match.params.podcastId
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loader />;
          if (error || !data.podcast) {
            return <div>Sorry! There was an error loading your podcast.</div>;
          }
          const { podcast } = data;
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

              <Feed podcastId={podcast.podcastId} />
            </div>
          );
        }}
      </Query>
    );
  }

  render() {
    return (
      <React.Fragment>
        <InnerHeader />
        {this.renderPodcast()}
      </React.Fragment>
    );
  }
}

export default PodcastPage;
