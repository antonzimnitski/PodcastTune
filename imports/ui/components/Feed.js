import React, { Component } from "react";
import { Session } from "meteor/session";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { withTracker } from "meteor/react-meteor-data";
import { isEqual } from "lodash";
import { setValue, placeEpisodeFirst } from "./../utils/utils";
import EpisodeModal from "./helpers/EpisodeModal";
import { graphql, compose } from "react-apollo";
import updateCurrentEpisode from "./../queries/updateCurrentEpisode";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      episode: null
    };

    this.handleEpisodeModal = this.handleEpisodeModal.bind(this);
  }

  handleClick(episode) {
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

  render() {
    return (
      <div className="feed">
        {this.props.episodes.map(episode => {
          if (!episode) return;

          const className =
            this.props.queue &&
            isEqual(this.props.queue[0].title, episode.title)
              ? "episode episode--active"
              : "episode";

          return (
            <div key={episode.id} className={className}>
              <div
                onClick={() => this.handleEpisodeModal(episode)}
                className="episode__title"
              >
                <p>{episode.title}</p>
              </div>
              <div className="episode__pub-date">
                <p>{moment(episode.pubDate).format("MMMM DD")}</p>
              </div>
              <div className="episode__duration">
                <p>{moment.duration(episode.duration, "seconds").format()}</p>
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
        })}

        {this.state.isModalOpen ? (
          <EpisodeModal
            isModalOpen={this.state.isModalOpen}
            handleEpisodeModal={this.handleEpisodeModal}
            episode={this.state.episode}
          />
        ) : null}
      </div>
    );
  }
}

export default compose(
  graphql(updateCurrentEpisode, { name: "updateCurrentEpisode" })
)(
  withTracker(() => {
    return {
      queue: Session.get("queue")
    };
  })(Feed)
);
