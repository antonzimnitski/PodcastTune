import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import InnerHeader from "./InnerHeader";
import Feed from "./Feed";
import Loader from "./helpers/Loader";
import SubscribeButton from "./helpers/SubscribeButton";

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

const GET_USER = gql`
  query {
    user {
      _id
    }
  }
`;

const GET_FEED = gql`
  query Feed($podcastId: Int!, $offset: Int!, $limit: Int!) {
    feed(podcastId: $podcastId, offset: $offset, limit: $limit) {
      id
      podcastId
      title
      pubDate
      duration
    }
  }
`;

class PodcastPage extends Component {
  _offset = 0;
  _limit = 100;

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

              <Query query={GET_USER}>
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) throw error;

                  return data.user._id ? (
                    <SubscribeButton podcastId={podcast.podcastId} />
                  ) : null;
                }}
              </Query>

              <Query
                query={GET_FEED}
                variables={{
                  podcastId: podcast.podcastId,
                  offset: this._offset,
                  limit: this._limit
                }}
              >
                {({ loading, error, data, fetchMore }) => {
                  if (loading) return <Loader />;
                  if (error) throw error;
                  if (data.feed.length === 0)
                    return <div>There is no episodes.</div>;

                  return (
                    <>
                      <Feed feed={data.feed} />

                      {data.feed.length >= this._offset + this._limit ? (
                        <button
                          className="button button--load"
                          onClick={() => {
                            this._offset = data.feed.length;
                            //https://www.apollographql.com/docs/react/features/pagination.html#numbered-pages
                            fetchMore({
                              variables: {
                                offset: this._offset
                              },
                              updateQuery: (prev, { fetchMoreResult }) => {
                                if (!fetchMoreResult) return prev;
                                return Object.assign({}, prev, {
                                  feed: [...prev.feed, ...fetchMoreResult.feed]
                                });
                              }
                            });
                          }}
                        >
                          load more
                        </button>
                      ) : null}
                    </>
                  );
                }}
              </Query>
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
