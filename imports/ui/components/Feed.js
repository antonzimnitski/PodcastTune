import React, { Component } from "react";
import { Session } from "meteor/session";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import EpisodeModal from "./helpers/EpisodeModal";
import { Query, graphql, compose } from "react-apollo";
import updateCurrentEpisode from "./../queries/updateCurrentEpisode";
import getCurrentEpisode from "./../queries/getCurrentEpisode";
import gql from "graphql-tag";
import Loader from "./helpers/Loader";
import { withTracker } from "meteor/react-meteor-data";

const GET_FEED = gql`
  query Feed($podcastId: Int!, $offset: Int!, $limit: Int!) {
    feed(podcastId: $podcastId, offset: $offset, limit: $limit) {
      id
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

  formatDate(date) {
    if (moment(date).isValid()) {
      const format =
        moment(date).year() === moment().year() ? "MMM D" : "MMM D, YYYY";
      return moment(date).format(format);
    }
    return "";
  }

  formatDuration(seconds) {
    if (!seconds) return "";
    return moment.duration(seconds, "seconds").format();
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
                  <div key={episode.id} className="episode">
                    <div
                      onClick={() => this.handleEpisodeModal(episode.id)}
                      className="episode__title"
                    >
                      <p>{episode.title}</p>
                    </div>
                    <div className="episode__pub-date">
                      <p>{this.formatDate(episode.pubDate)}</p>
                    </div>
                    <div className="episode__duration">
                      <p>{this.formatDuration(episode.duration)}</p>
                    </div>
                    <div className="episode__controls">
                      <svg
                        className="controls__play"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 250 250"
                      >
                        <g
                          onClick={() =>
                            this.handleClick(episode.id, this.props.podcastId)
                          }
                          id="icon"
                        >
                          <g id="circle">
                            <circle
                              className="play__circle"
                              cx="125"
                              cy="125"
                              r="115"
                              fill="#fff"
                            />
                            <path d="M125,20A105,105,0,1,1,20,125,105.12,105.12,0,0,1,125,20m0-20A125,125,0,1,0,250,125,125,125,0,0,0,125,0Z" />
                          </g>
                          <g className="play__inner" id="inner">
                            <g className="play__bars" id="bars">
                              <g id="left">
                                <rect
                                  x="92.5"
                                  y="87.5"
                                  width="15"
                                  height="75"
                                  fill="#fff"
                                />
                                <polygon points="117.5 77.5 82.5 77.5 82.5 172.5 117.5 172.5 117.5 77.5 117.5 77.5" />
                              </g>
                              <g id="right">
                                <rect
                                  x="142.5"
                                  y="87.5"
                                  width="15"
                                  height="75"
                                  fill="#fff"
                                />
                                <polygon points="167.5 77.5 132.5 77.5 132.5 172.5 167.5 172.5 167.5 77.5 167.5 77.5" />
                              </g>
                            </g>
                            <path
                              className="play__triangle"
                              id="triangle"
                              d="M183.25,125,95.87,175.45V74.55Z"
                            />
                          </g>
                        </g>
                      </svg>
                    </div>
                  </div>
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
