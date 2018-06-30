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

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      episode: null,
      offset: 0,
      limit: 100
    };

    this.handleEpisodeModal = this.handleEpisodeModal.bind(this);
  }

  handleClick(episode) {
    if (
      this.props.currentEpisode &&
      this.props.currentEpisode.title === episode.title
    )
      return console.log("it's current");
    this.props.updateCurrentEpisode({
      variables: {
        episode
      }
    });
    Session.set("isPlayerOpen", true);
  }

  handleEpisodeModal(episode) {
    this.setState({ isModalOpen: !this.state.isModalOpen, episode });
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
          offset: this.state.offset,
          limit: this.state.limit
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <Loader />;
          if (error) throw error;
          if (data.feed.length === 0) return <div>There is no episodes.</div>;

          return data.feed.map((episode, index) => {
            if (!episode) return;
            return (
              <div key={episode.id} className="episode">
                <div
                  onClick={() => this.handleEpisodeModal(episode)}
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
                    <g onClick={() => this.handleClick(episode)} id="icon">
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
          });
        }}
      </Query>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div className="feed">{this.renderFeed()} </div>

        {/* {this.state.limit <= this.props.episodes.length - 1 ? (
          <button
            className="button button--load"
            onClick={() => this.setState({ limit: this.state.limit + 100 })}
          >
            load more
          </button>
        ) : null} */}

        {this.state.isModalOpen ? (
          <EpisodeModal
            isModalOpen={this.state.isModalOpen}
            handleEpisodeModal={this.handleEpisodeModal}
            episode={this.state.episode}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default compose(
  graphql(getCurrentEpisode, {
    props: ({ data: { currentEpisode } }) => ({
      currentEpisode
    })
  }),
  graphql(updateCurrentEpisode, { name: "updateCurrentEpisode" })
)(Feed);
