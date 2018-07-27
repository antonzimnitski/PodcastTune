import React, { Component } from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import momentDurationFormatSetup from "moment-duration-format";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { withApollo, graphql, compose } from "react-apollo";
import { remove } from "lodash";

import getInProgress from "./../../queries/getInProgress";
import getUpnext from "./../../queries/getUpnext";
import getFavorites from "./../../queries/getFavorites";
import getPlayingEpisode from "./../../queries/getPlayingEpisode";

import removeFromUpnext from "./../../queries/removeFromUpnext";
import addToUpnext from "./../../queries/addToUpnext";
import removeFromFavorites from "./../../queries/removeFromFavorites";
import addToFavorites from "./../../queries/addToFavorites";
import markAsUnplayed from "./../../queries/markAsUnplayed";
import markAsPlayed from "./../../queries/markAsPlayed";
import setPlayingEpisode from "./../../queries/setPlayingEpisode";

import setLocalPlayingEpisode from "./../../../localData/queries/setLocalPlayingEpisode";
import getLocalPlayingEpisode from "./../../../localData/queries/getLocalPlayingEpisode";
import addToLocalUpnext from "./../../../localData/queries/addToLocalUpnext";
import removeFromLocalUpnext from "./../../../localData/queries/removeFromLocalUpnext";
import markLocalAsPlayed from "./../../../localData/queries/markLocalAsPlayed";
import markLocalAsUnplayed from "./../../../localData/queries/markLocalAsUnplayed";
import getLocalUpnext from "./../../../localData/queries/getLocalUpnext";

import clearLocalPlayingEpisode from "./../../../localData/queries/clearLocalPlayingEpisode";
import clearPlayingEpisode from "./../../queries/clearPlayingEpisode";

import isPLaying from "./../../../localData/queries/isPlaying";
import play from "./../../../localData/queries/play";
import pause from "./../../../localData/queries/pause";

class Episode extends Component {
  formatDate(date) {
    if (date && moment(date).isValid()) {
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

  handleClick(id, podcastId, isPlayingEpisode) {
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
    const { isLoggedIn, isPlayingEpisode } = this.props;

    if (isPlayingEpisode) {
      console.log("currentEpisode");
      return;
    }

    isLoggedIn
      ? this.loggedUpnext(id, podcastId, isInUpNext)
      : this.localUpnext(id, podcastId, isInUpNext);
  }

  removeFromCache(proxy, query, field, returnedObj) {
    const { client } = this.props;
    try {
      const data = proxy.readQuery({ query });
      remove(data[field], n => n.id === returnedObj.id);
      proxy.writeQuery({ query, data });
    } catch (e) {
      client.query({ query });
      console.log("query haven't been called", query);
    }
  }

  addToCache(proxy, query, field, returnedObj) {
    const { client } = this.props;
    try {
      const data = proxy.readQuery({ query });
      remove(data.upnext, n => n.id === returnedObj.id);
      data[field]
        ? data[field].push(returnedObj)
        : (data[field] = [returnedObj]);
      proxy.writeQuery({ query, data });
    } catch (e) {
      client.query({ query });
      console.log("query haven't been called", query);
    }
  }

  loggedUpnext(id, podcastId, isInUpNext) {
    const { removeFromUpnext, addToUpnext } = this.props;

    isInUpNext
      ? removeFromUpnext({
          variables: { id, podcastId },
          update: (proxy, { data: { removeFromUpnext } }) =>
            this.removeFromCache(proxy, getUpnext, "upnext", removeFromUpnext)
        }).catch(err => console.log("Error in removeFromUpnext", err))
      : addToUpnext({
          variables: { id, podcastId },
          update: (proxy, { data: { addToUpnext } }) =>
            this.addToCache(proxy, getUpnext, "upnext", addToUpnext)
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
    const { removeFromFavorites, addToFavorites } = this.props;
    isInFavorites
      ? removeFromFavorites({
          variables: { id, podcastId },
          update: (proxy, { data: { removeFromFavorites } }) =>
            this.removeFromCache(
              proxy,
              getFavorites,
              "favorites",
              removeFromFavorites
            )
        }).catch(err => console.log("Error in removeFromFavorites", err))
      : addToFavorites({
          variables: { id, podcastId },
          update: (proxy, { data: { addToFavorites } }) =>
            this.removeFromCache(
              proxy,
              getFavorites,
              "favorites",
              addToFavorites
            )
        }).catch(err => console.log("Error in addToFavorites", err));
  }

  render() {
    const {
      episode,
      isPlayingEpisode,
      openWarningModal,
      handleEpisodeModal,
      isLoggedIn,
      isPlaying
    } = this.props;

    const {
      inFavorites,
      inUpnext,
      isPlayed,
      podcastArtworkUrl,
      podcastId,
      id,
      title,
      author,
      pubDate,
      duration
    } = episode;
    const episodeClassName = `episode${
      isPlayingEpisode && isPlaying ? " episode--playing" : ""
    }${inUpnext ? " episode--in-upnext" : ""}${
      inFavorites ? " episode--in-favorites" : ""
    }${isPlayed ? " episode--played" : ""}`;

    return (
      <div className={episodeClassName}>
        {podcastArtworkUrl ? (
          <Link to={`/podcasts/${podcastId}`}>
            <div
              className="episode__artwork"
              style={{
                backgroundImage: `url("${podcastArtworkUrl}")`
              }}
            />
          </Link>
        ) : null}
        <div className="episode__info">
          <div className="episode__primary">
            <div className="episode__title">
              <p
                className="title__text"
                title={title}
                onClick={() => handleEpisodeModal(id, podcastId)}
              >
                {title}
              </p>
              <svg
                className="star__icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 168.8 160.5"
                onClick={() =>
                  isLoggedIn
                    ? this.handleFavorites(id, podcastId, inFavorites)
                    : openWarningModal()
                }
              >
                <path d="M168.8 61.3l-58.3-8.5L84.4 0 58.3 52.8 0 61.3l42.2 41.1-10 58.1 52.2-27.4 52.2 27.4-10-58.1 42.2-41.1z" />
              </svg>
            </div>
          </div>

          {author ? (
            <p className="episode__author">
              <Link to={`/podcasts/${podcastId}`}>{author}</Link>
            </p>
          ) : null}
        </div>
        <div className="episode__pub-date">
          <p>{this.formatDate(pubDate)}</p>
        </div>
        <div className="episode__duration">
          <p>{this.formatDuration(duration)}</p>
        </div>
        <div className="episode__controls">
          <div
            onClick={() =>
              isPlayingEpisode
                ? this.handlePlayingEpisode(id, podcastId)
                : this.handlePlayedStatus(id, podcastId, isPlayed)
            }
          >
            <svg
              className="controls__status-icon"
              viewBox="0 0 406 299"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="status-icon__unplayed"
                d="M398 7a25 25 0 0 0-35 0L132 239 43 150a25 25 0 0 0-35 0 25 25 0 0 0 0 35l106 106a25 25 0 0 0 31 3 25 25 0 0 0 6-5L398 43a25 25 0 0 0 0-35z"
              />
              <path
                className="status-icon__played"
                d="M238 149L344 43a25 25 0 0 0 0-35 25 25 0 0 0-35 0L203 114 97 8a25 25 0 0 0-35 0 25 25 0 0 0 0 35L167 149 61 255a25 25 0 0 0 0 35 25 25 0 0 0 35 0l106-106 106 106a25 25 0 0 0 35 0 25 25 0 0 0 0-35z"
              />
            </svg>
          </div>
          <div
            onClick={() =>
              !isPlayingEpisode
                ? this.handleUpnext(id, podcastId, inUpnext)
                : console.log("playingEpisode")
            }
          >
            <svg
              className="controls__up-next"
              viewBox="0 0 179 153"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="up-next__add"
                d="M173 30h-24V6a6 6 0 1 0-12 0v24h-24a6 6 0 0 0-6 6 6 6 0 0 0 6 6h24v24a6 6 0 1 0 12 0V42H173a6 6 0 0 0 6-6 6 6 0 0 0-6-6z"
              />
              <rect y="78" width="150" height="25" rx="13" ry="13" />
              <rect y="128" width="150" height="25" rx="13" ry="13" />
              <rect y="28" width="100" height="25" rx="13" ry="13" />
              <path
                className="up-next__remove"
                d="M162 6l-20 20-20-20a7 7 0 0 0-10 10l20 20-20 20a7 7 0 0 0 0 10 7 7 0 0 0 10 0l20-20L162 66a7 7 0 0 0 10-10l-20-20 20-20a7 7 0 0 0 0-10 7 7 0 0 0-10 0z"
              />
            </svg>
          </div>

          <div
            onClick={() => this.handleClick(id, podcastId, isPlayingEpisode)}
          >
            <svg
              className="controls__play"
              viewBox="0 0 250 250"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle className="play__circle" cx="125" cy="125" r="115" />
              <path d="M125,20A105,105,0,1,1,20,125,105,105,0,0,1,125,20m0-20A125,125,0,1,0,250,125,125,125,0,0,0,125,0Z" />
              <g className="play__inner">
                <g className="play__bars">
                  <rect x="93" y="88" width="15" height="75" />
                  <polygon points="118 78 83 78 83 173 118 173 118 78" />
                  <rect x="143" y="88" width="15" height="75" />
                  <polygon points="168 78 133 78 133 173 168 173 168 78" />
                </g>
                <path className="play__triangle" d="m183 125-87 50v-101z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    );
  }
}

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
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
  )(withApollo(Episode))
);
