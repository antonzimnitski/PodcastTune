import React, { Component } from "react";
import { Session } from "meteor/session";
import { graphql, compose } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";

import EpisodeModal from "./helpers/EpisodeModal";
import Episode from "./helpers/Episode";

import getUpnextIds from "./../queries/getUpnextIds";
import getPlayingEpisode from "./../queries/getPlayingEpisode";
import setPlayingEpisode from "./../queries/setPlayingEpisode";
import getFavoritesIds from "./../queries/getFavoritesIds";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      id: null,
      podcastId: null
    };

    this.handleEpisodeModal = this.handleEpisodeModal.bind(this);
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
            { query: getUpnextIds }
          ]
        })
          .then(res => console.log("success", res.data))
          .catch(err => console.log(err))
      : console.log("todo it later", id, podcastId);

    Session.set("isPlayerOpen", true);
  }

  handleEpisodeModal(id, podcastId) {
    this.setState({ isModalOpen: !this.state.isModalOpen, id, podcastId });
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
        {this.props.feed.map(episode => {
          if (!episode) return;
          return (
            <Episode
              key={episode.id}
              episode={episode}
              handleEpisodeModal={this.handleEpisodeModal}
              handleClick={this.handleClick}
              isPlayingEpisode={this.isPlayingEpisode(episode.id)}
              upnext={this.props.upnext}
              favorites={this.props.favorites}
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

        {this.state.isModalOpen ? (
          <EpisodeModal
            isModalOpen={this.state.isModalOpen}
            handleEpisodeModal={this.handleEpisodeModal}
            podcastId={this.state.podcastId}
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
    graphql(setPlayingEpisode, { name: "setPlayingEpisode" }),
    graphql(getPlayingEpisode, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { playingEpisode } }) => ({
        playingEpisode
      })
    }),
    graphql(getUpnextIds, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { upnext } }) => ({
        upnext
      })
    }),
    graphql(getFavoritesIds, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { favorites } }) => ({
        favorites
      })
    })
  )(Feed)
);
