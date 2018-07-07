import React, { Component } from "react";
import { Session } from "meteor/session";
import EpisodeModal from "./helpers/EpisodeModal";
import { Query, graphql, compose } from "react-apollo";
import updateCurrentEpisode from "./../queries/updateCurrentEpisode";
import getCurrentEpisode from "./../queries/getCurrentEpisode";
import gql from "graphql-tag";
import { withTracker } from "meteor/react-meteor-data";

import Loader from "./helpers/Loader";
import Episode from "./helpers/Episode";

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

const GET_UPNEXT = gql`
  query Upnext {
    upnext {
      id
      podcastId
      podcastArtworkUrl
      title
      author
    }
  }
`;

const SET_PLAYING_EPISODE = gql`
  mutation SetPlayingEpisode($id: String!, $podcastId: Int!) {
    setPlayingEpisode(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;

const GET_PLAYING_EPISODE = gql`
  query PlayingEpisode {
    playingEpisode {
      id
      podcastId
      podcastArtworkUrl
      title
      mediaUrl
      pubDate
      playedSeconds
      author
    }
  }
`;

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      id: null
    };

    this.handleEpisodeModal = this.handleEpisodeModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  _offset = 0;
  _limit = 100;

  handleClick(id, podcastId) {
    const { isLoggedIn, setPlayingEpisode } = this.props;
    isLoggedIn
      ? setPlayingEpisode({
          variables: {
            id,
            podcastId
          },
          refetchQueries: [
            { query: GET_PLAYING_EPISODE },
            { query: GET_UPNEXT }
          ]
        })
          .then(res => console.log("success", res.data))
          .catch(err => console.log(err))
      : console.log("todo it later", id, podcastId);
    // if (
    //   this.props.currentEpisode &&
    //   this.props.currentEpisode.title === episode.title
    // )
    //   return console.log("it's current");
    // this.props.updateCurrentEpisode({
    //   variables: {
    //     episode
    //   }
    // });
    Session.set("isPlayerOpen", true);
  }

  handleEpisodeModal(id) {
    this.setState({ isModalOpen: !this.state.isModalOpen, id });
  }

  /* const className =
        this.props.queue &&
        isEqual(this.props.queue[0].title, episode.title)
          ? "episode episode--active"
          : "episode"; */

  renderFeed() {
    return (
      <Query
        query={GET_FEED}
        variables={{
          podcastId: this.props.podcastId,
          offset: this._offset,
          limit: this._limit
        }}
      >
        {({ loading, error, data, fetchMore }) => {
          if (loading) return <Loader />;
          if (error) throw error;
          if (data.feed.length === 0) return <div>There is no episodes.</div>;

          return (
            <div className="feed">
              {data.feed.map(episode => {
                if (!episode) return;
                return (
                  <Episode
                    key={episode.id}
                    episode={episode}
                    handleEpisodeModal={this.handleEpisodeModal}
                    handleClick={this.handleClick}
                  />
                );
              })}

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
            </div>
          );
        }}
      </Query>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderFeed()}

        {this.state.isModalOpen ? (
          <EpisodeModal
            isModalOpen={this.state.isModalOpen}
            handleEpisodeModal={this.handleEpisodeModal}
            podcastId={this.props.podcastId}
            id={this.state.id}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(getCurrentEpisode, {
      props: ({ data: { currentEpisode } }) => ({
        currentEpisode
      })
    }),
    graphql(updateCurrentEpisode, { name: "updateCurrentEpisode" }),
    graphql(SET_PLAYING_EPISODE, { name: "setPlayingEpisode" })
  )(Feed)
);
