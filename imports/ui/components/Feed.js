import React, { Component } from "react";
import { Session } from "meteor/session";
import { graphql, compose } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";

import EpisodeModal from "./helpers/EpisodeModal";
import Episode from "./helpers/Episode";
import LoginWarningModal from "./helpers/LoginWarningModal";

import getPlayingEpisode from "./../queries/getPlayingEpisode";
import setPlayingEpisode from "./../queries/setPlayingEpisode";
import getInProgress from "./../queries/getInProgress";
import getUpnext from "./../queries/getUpnext";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEpisodeModalOpen: false,
      isWarningModalOpen: false,
      id: null,
      podcastId: null
    };

    this.handleEpisodeModal = this.handleEpisodeModal.bind(this);
    this.closeWarningModal = this.closeWarningModal.bind(this);
    this.openWarningModal = this.openWarningModal.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(id, podcastId) {
    const { isLoggedIn, setPlayingEpisode } = this.props;
    isLoggedIn
      ? setPlayingEpisode({
          variables: {
            id,
            podcastId
          },
          refetchQueries: [
            { query: getPlayingEpisode },
            { query: getInProgress },
            { query: getUpnext }
          ]
        })
          .then(res => console.log("success", res.data))
          .catch(err => console.log(err))
      : console.log("todo it later", id, podcastId);
  }

  handleEpisodeModal(id, podcastId) {
    this.setState({
      isEpisodeModalOpen: !this.state.isEpisodeModalOpen,
      id,
      podcastId
    });
  }

  openWarningModal() {
    this.setState({ isWarningModalOpen: true });
  }

  closeWarningModal() {
    this.setState({ isWarningModalOpen: false });
  }

  isPlayingEpisode(id) {
    const { playingEpisode } = this.props;
    if (!playingEpisode) return false;

    return playingEpisode.id === id;
  }

  renderFeed() {
    if (this.props.feed.length === 0) return <div>There is no episodes.</div>;
    return (
      <div className="feed">
        <div className="feed__header">
          <div className="episode__info">Episode title</div>
          <div className="episode__pub-date">Release Date</div>
          <div className="episode__duration">Duration</div>
          <div className="episode__controls" />
        </div>
        {this.props.feed.map(episode => {
          if (!episode) return;
          return (
            <Episode
              key={episode.id}
              episode={episode}
              openWarningModal={this.openWarningModal}
              handleEpisodeModal={this.handleEpisodeModal}
              handleClick={this.handleClick}
              isPlayingEpisode={this.isPlayingEpisode(episode.id)}
            />
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderFeed()}

        {this.state.isEpisodeModalOpen ? (
          <EpisodeModal
            isModalOpen={this.state.isEpisodeModalOpen}
            handleEpisodeModal={this.handleEpisodeModal}
            podcastId={this.state.podcastId}
            id={this.state.id}
          />
        ) : null}
        {this.state.isWarningModalOpen ? (
          <LoginWarningModal
            isModalOpen={this.state.isWarningModalOpen}
            closeWarningModal={this.closeWarningModal}
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
    graphql(setPlayingEpisode, { name: "setPlayingEpisode" }),
    graphql(getPlayingEpisode, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { playingEpisode } }) => ({
        playingEpisode
      })
    })
  )(Feed)
);
