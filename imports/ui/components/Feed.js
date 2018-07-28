import React, { Component } from "react";
import { withApollo, graphql, compose } from "react-apollo";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { removeFromCache, addToCache } from "./../utils/apolloCache";

import EpisodeModal from "./helpers/EpisodeModal";
import Episode from "./helpers/Episode";
import LoginWarningModal from "./helpers/LoginWarningModal";

import getInProgress from "./../queries/getInProgress";
import getUpnext from "./../queries/getUpnext";
import getFavorites from "./../queries/getFavorites";
import getPlayingEpisode from "./../queries/getPlayingEpisode";

import removeFromUpnext from "./../queries/removeFromUpnext";
import addToUpnext from "./../queries/addToUpnext";
import removeFromFavorites from "./../queries/removeFromFavorites";
import addToFavorites from "./../queries/addToFavorites";
import markAsUnplayed from "./../queries/markAsUnplayed";
import markAsPlayed from "./../queries/markAsPlayed";
import setPlayingEpisode from "./../queries/setPlayingEpisode";

import setLocalPlayingEpisode from "./../../localData/queries/setLocalPlayingEpisode";
import getLocalPlayingEpisode from "./../../localData/queries/getLocalPlayingEpisode";
import addToLocalUpnext from "./../../localData/queries/addToLocalUpnext";
import removeFromLocalUpnext from "./../../localData/queries/removeFromLocalUpnext";
import markLocalAsPlayed from "./../../localData/queries/markLocalAsPlayed";
import markLocalAsUnplayed from "./../../localData/queries/markLocalAsUnplayed";
import getLocalUpnext from "./../../localData/queries/getLocalUpnext";

import clearLocalPlayingEpisode from "./../../localData/queries/clearLocalPlayingEpisode";
import clearPlayingEpisode from "./../queries/clearPlayingEpisode";

import isPLaying from "./../../localData/queries/isPlaying";
import play from "./../../localData/queries/play";
import pause from "./../../localData/queries/pause";

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
    this.handleFavorites = this.handleFavorites.bind(this);
    this.handleStatus = this.handleStatus.bind(this);
    this.handleUpnext = this.handleUpnext.bind(this);
    this.handleClick = this.handleClick.bind(this);
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
    const playingEpisode =
      this.props.playingEpisode || this.props.localPlayingEpisode;
    if (!playingEpisode) return false;

    return playingEpisode.id === id;
  }

  handleClick(id, podcastId) {
    const isPlayingEpisode = this.isPlayingEpisode(id);

    const { pause, play, isPlaying, isLoggedIn } = this.props;

    if (!isPlayingEpisode) {
      isLoggedIn
        ? this.loggedClick(id, podcastId)
        : this.localClick(id, podcastId);
    } else {
      isPlaying ? pause() : play();
    }
  }

  loggedClick(id, podcastId) {
    const { setPlayingEpisode } = this.props;

    setPlayingEpisode({
      variables: { id, podcastId },
      refetchQueries: [
        { query: getPlayingEpisode },
        { query: getInProgress },
        { query: getUpnext }
      ]
    }).catch(err => console.log("Error in setPlayingEpisode on client", err));
  }

  localClick(id, podcastId) {
    const { setLocalPlayingEpisode } = this.props;

    setLocalPlayingEpisode({
      variables: { id, podcastId },
      refetchQueries: [{ query: getLocalPlayingEpisode }]
    }).catch(err =>
      console.log("Error in setLocalPlayingEpisode on client", err)
    );
  }

  handleStatus(id, podcastId, isPlayed) {
    const isPlayingEpisode = this.isPlayingEpisode(id);

    isPlayingEpisode
      ? this.handlePlayingEpisode(id, podcastId)
      : this.handlePlayedStatus(id, podcastId, isPlayed);
  }

  handlePlayedStatus(id, podcastId, isPlayed) {
    this.props.isLoggedIn
      ? this.loggedPlayedStatus(id, podcastId, isPlayed)
      : this.localPlayedStatus(id, isPlayed);
  }

  loggedPlayedStatus(id, podcastId, isPlayed) {
    const { markAsUnplayed, markAsPlayed } = this.props;

    isPlayed
      ? markAsUnplayed({
          variables: { id, podcastId }
        }).catch(err => console.log("Error in markAsUnplayed", err))
      : markAsPlayed({
          variables: { id, podcastId }
        }).catch(err => console.log("Error in markAsPlayed", err));
  }

  localPlayedStatus(id, isPlayed) {
    const { markLocalAsUnplayed, markLocalAsPlayed } = this.props;

    isPlayed
      ? markLocalAsUnplayed({
          variables: { id }
        }).catch(err => console.log("Error in markLocalAsUnplayed", err))
      : markLocalAsPlayed({
          variables: { id }
        }).catch(err => console.log("Error in markLocalAsPlayed", err));
  }

  handlePlayingEpisode(id, podcastId) {
    this.props.isLoggedIn
      ? this.loggedPlayingEpisode(id, podcastId)
      : this.localPlayingEpisode(id);
  }

  loggedPlayingEpisode(id, podcastId) {
    const { markAsPlayed, clearPlayingEpisode } = this.props;

    markAsPlayed({
      variables: { id, podcastId }
    });
    clearPlayingEpisode({
      refetchQueries: [{ query: getPlayingEpisode }, { query: getUpnext }]
    });
  }

  localPlayingEpisode(id) {
    const { markLocalAsPlayed, clearLocalPlayingEpisode } = this.props;

    markLocalAsPlayed({
      variables: { id }
    });
    clearLocalPlayingEpisode({
      refetchQueries: [
        { query: getLocalPlayingEpisode },
        { query: getLocalUpnext }
      ]
    });
  }

  handleUpnext(id, podcastId, isInUpNext) {
    const isPlayingEpisode = this.isPlayingEpisode(id);

    if (isPlayingEpisode) {
      console.log("currentEpisode");
      return;
    }

    this.props.isLoggedIn
      ? this.loggedUpnext(id, podcastId, isInUpNext)
      : this.localUpnext(id, podcastId, isInUpNext);
  }

  loggedUpnext(id, podcastId, isInUpNext) {
    const { removeFromUpnext, addToUpnext, client } = this.props;

    isInUpNext
      ? removeFromUpnext({
          variables: { id, podcastId },
          update: (proxy, { data: { removeFromUpnext } }) =>
            removeFromCache(
              proxy,
              client,
              getUpnext,
              "upnext",
              removeFromUpnext
            )
        }).catch(err => console.log("Error in removeFromUpnext", err))
      : addToUpnext({
          variables: { id, podcastId },
          update: (proxy, { data: { addToUpnext } }) =>
            addToCache(proxy, client, getUpnext, "upnext", addToUpnext)
        }).catch(err => console.log("Error in addToUpnext", err));
  }

  localUpnext(id, podcastId, isInUpNext) {
    const { removeFromLocalUpnext, addToLocalUpnext } = this.props;

    isInUpNext
      ? removeFromLocalUpnext({
          variables: { id }
        }).catch(err => console.log("Error in removeFromLocalUpnext", err))
      : addToLocalUpnext({
          variables: { id, podcastId }
        }).catch(err => console.log("Error in addToLocalUpnext", err));
  }

  handleFavorites(id, podcastId, isInFavorites) {
    this.props.isLoggedIn
      ? this.loggedFavorites(id, podcastId, isInFavorites)
      : this.openWarningModal();
  }

  loggedFavorites(id, podcastId, isInFavorites) {
    const { removeFromFavorites, addToFavorites, client } = this.props;
    isInFavorites
      ? removeFromFavorites({
          variables: { id, podcastId },
          update: (proxy, { data: { removeFromFavorites } }) =>
            removeFromCache(
              proxy,
              client,
              getFavorites,
              "favorites",
              removeFromFavorites
            )
        }).catch(err => console.log("Error in removeFromFavorites", err))
      : addToFavorites({
          variables: { id, podcastId },
          update: (proxy, { data: { addToFavorites } }) =>
            removeFromCache(
              proxy,
              client,
              getFavorites,
              "favorites",
              addToFavorites
            )
        }).catch(err => console.log("Error in addToFavorites", err));
  }

  renderFeed() {
    const { feed, isPlaying } = this.props;
    if (feed.length === 0) return <div>There is no episodes.</div>;
    return (
      <div className="feed">
        <div className="feed__header">
          <div className="episode__info">Episode title</div>
          <div className="episode__pub-date">Release Date</div>
          <div className="episode__duration">Duration</div>
          <div className="episode__controls" />
        </div>
        {feed.map(episode => {
          if (!episode) return;
          const { id, inUpnext, inFavorites, isPlayed } = episode;
          const isPlayingEpisode = this.isPlayingEpisode(id);

          const className = `episode${
            isPlayingEpisode && isPlaying ? " episode--playing" : ""
          }${inUpnext ? " episode--in-upnext" : ""}${
            inFavorites ? " episode--in-favorites" : ""
          }${isPlayed ? " episode--played" : ""}`;
          return (
            <Episode
              key={id}
              episode={episode}
              className={className}
              handleEpisodeModal={this.handleEpisodeModal}
              handleFavorites={this.handleFavorites}
              handleStatus={this.handleStatus}
              handleUpnext={this.handleUpnext}
              handleClick={this.handleClick}
            />
          );
        })}
      </div>
    );
  }

  render() {
    const {
      isEpisodeModalOpen,
      isWarningModalOpen,
      podcastId,
      id
    } = this.state;
    return (
      <React.Fragment>
        {this.renderFeed()}

        {isEpisodeModalOpen ? (
          <EpisodeModal
            isModalOpen={isEpisodeModalOpen}
            handleEpisodeModal={this.handleEpisodeModal}
            podcastId={podcastId}
            id={id}
          />
        ) : null}
        {this.state.isWarningModalOpen ? (
          <LoginWarningModal
            isModalOpen={isWarningModalOpen}
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
    graphql(getPlayingEpisode, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { playingEpisode } }) => ({
        playingEpisode
      })
    }),
    graphql(getLocalPlayingEpisode, {
      skip: props => props.isLoggedIn,
      props: ({ data: { localPlayingEpisode } }) => ({
        localPlayingEpisode
      })
    }),
    graphql(isPLaying, {
      props: ({ data: { isPlaying } }) => ({
        isPlaying
      })
    }),
    graphql(setPlayingEpisode, { name: "setPlayingEpisode" }),
    graphql(addToUpnext, { name: "addToUpnext" }),
    graphql(removeFromUpnext, { name: "removeFromUpnext" }),
    graphql(addToFavorites, { name: "addToFavorites" }),
    graphql(removeFromFavorites, { name: "removeFromFavorites" }),
    graphql(markAsPlayed, { name: "markAsPlayed" }),
    graphql(markAsUnplayed, { name: "markAsUnplayed" }),
    graphql(markLocalAsPlayed, { name: "markLocalAsPlayed" }),
    graphql(markLocalAsUnplayed, { name: "markLocalAsUnplayed" }),
    graphql(addToLocalUpnext, { name: "addToLocalUpnext" }),
    graphql(removeFromLocalUpnext, { name: "removeFromLocalUpnext" }),
    graphql(setLocalPlayingEpisode, { name: "setLocalPlayingEpisode" }),
    graphql(play, { name: "play" }),
    graphql(pause, { name: "pause" }),
    graphql(clearPlayingEpisode, { name: "clearPlayingEpisode" }),
    graphql(clearLocalPlayingEpisode, { name: "clearLocalPlayingEpisode" })
  )(withApollo(Feed))
);
