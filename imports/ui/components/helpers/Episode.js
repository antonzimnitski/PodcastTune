import React, { Component } from "react";
import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { Query, graphql, compose } from "react-apollo";
import gql from "graphql-tag";

const GET_UPNEXT = gql`
  query Upnext {
    upnext {
      id
    }
  }
`;

const REMOVE_FROM_UPNEXT = gql`
  mutation RemoveFromUpnext($id: String!, $podcastId: Int!) {
    removeFromUpnext(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;

const ADD_TO_UPNEXT = gql`
  mutation AddToUpnext($id: String!, $podcastId: Int!) {
    addToUpnext(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;

const GET_FAVORITES = gql`
  query Favorites {
    favorites {
      id
    }
  }
`;

const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($id: String!, $podcastId: Int!) {
    removeFromFavorites(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;

const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($id: String!, $podcastId: Int!) {
    addToFavorites(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;

class Episode extends Component {
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

  isInUpNext(id) {
    const { upnext } = this.props;
    if (!upnext || !upnext.length) return false;

    return !!upnext.find(el => {
      if (el) return el.id === id;
    });
  }

  isInFavorites(id) {
    const { favorites } = this.props;
    if (!favorites || !favorites.length) return false;

    return !!favorites.find(el => {
      if (el) return el.id === id;
    });
  }

  handleUpnext(id, podcastId, isInUpNext) {
    const { removeFromUpnext, addToUpnext } = this.props;
    isInUpNext
      ? removeFromUpnext({
          variables: {
            id,
            podcastId
          },
          refetchQueries: [{ query: GET_UPNEXT }]
        })
          .then(res => console.log("Episode removed from upnext", res.data))
          .catch(err => console.log(err))
      : addToUpnext({
          variables: {
            id,
            podcastId
          },
          refetchQueries: [{ query: GET_UPNEXT }]
        })
          .then(res => console.log("Episode added from upnext", res.data))
          .catch(err => console.log(err));
  }

  handleFavorites(id, podcastId, isInFavorites) {
    const { removeFromFavorites, addToFavorites } = this.props;
    isInFavorites
      ? removeFromFavorites({
          variables: {
            id,
            podcastId
          },
          refetchQueries: [{ query: GET_FAVORITES }]
        })
          .then(res => console.log("Episode removed from Favorites", res.data))
          .catch(err => console.log(err))
      : addToFavorites({
          variables: {
            id,
            podcastId
          },
          refetchQueries: [{ query: GET_FAVORITES }]
        })
          .then(res => console.log("Episode added Favorites", res.data))
          .catch(err => console.log(err));
  }

  render() {
    const {
      episode,
      isPlayingEpisode,
      handleEpisodeModal,
      handleClick,
      isLoggedIn
    } = this.props;
    const episodeClassName = `episode${
      isPlayingEpisode ? " episode--playing" : ""
    }${this.isInUpNext(episode.id) ? " episode--in-upnext" : ""}${
      this.isInFavorites(episode.id) ? " episode--in-favorites" : ""
    }`;

    return (
      <div className={episodeClassName}>
        {episode.podcastArtworkUrl ? (
          <div
            className="episode__artwork"
            style={{
              backgroundImage: `url("${episode.podcastArtworkUrl}")`
            }}
          />
        ) : null}
        <div className="episode__info">
          <div className="episode__primary">
            <div className="episode__title">
              <p
                className="title__text"
                onClick={() =>
                  handleEpisodeModal(episode.id, episode.podcastId)
                }
              >
                {episode.title}
              </p>
              <svg
                className="star__icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 168.8 160.5"
                onClick={() =>
                  isLoggedIn
                    ? this.handleFavorites(
                        episode.id,
                        episode.podcastId,
                        this.isInFavorites(episode.id)
                      )
                    : console.log("loggin on signup")
                }
              >
                <path d="M168.8 61.3l-58.3-8.5L84.4 0 58.3 52.8 0 61.3l42.2 41.1-10 58.1 52.2-27.4 52.2 27.4-10-58.1 42.2-41.1z" />
              </svg>
            </div>
          </div>

          {episode.author ? (
            <p className="episode__author">{episode.author}</p>
          ) : null}
        </div>
        <div className="episode__pub-date">
          <p>{this.formatDate(episode.pubDate)}</p>
        </div>
        <div className="episode__duration">
          <p>{this.formatDuration(episode.duration)}</p>
        </div>
        <div className="episode__controls">
          <div
            onClick={() =>
              isLoggedIn && !isPlayingEpisode
                ? this.handleUpnext(
                    episode.id,
                    episode.podcastId,
                    this.isInUpNext(episode.id)
                  )
                : console.log("loggin on signup")
            }
          >
            <svg
              className="controls__up-next"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 179 152.5"
            >
              <path
                className="up-next__add"
                d="M173 30.21h-24.21V6a6 6 0 1 0-12.08 0v24.21h-24.17a6.06 6.06 0 0 0-6 6 6.06 6.06 0 0 0 6 6h24.17v24.25a6 6 0 1 0 12.08 0V42.29H173a6.06 6.06 0 0 0 6-6 6.06 6.06 0 0 0-6-6.08z"
              />
              <rect y="77.5" width="150" height="25" rx="12.5" ry="12.5" />
              <rect y="127.5" width="150" height="25" rx="12.5" ry="12.5" />
              <rect y="27.5" width="100" height="25" rx="12.5" ry="12.5" />
              <path
                className="up-next__remove"
                d="M162.44 5.62l-20.13 20.12-20.13-20.12a7.11 7.11 0 0 0-10.06 10.06l20.12 20.13-20.12 20.13a7.13 7.13 0 0 0 0 10.06 7.13 7.13 0 0 0 10.06 0l20.13-20.13L162.44 66a7.11 7.11 0 0 0 10.06-10.06l-20.13-20.13 20.13-20.13a7.13 7.13 0 0 0 0-10.06 7.13 7.13 0 0 0-10.06 0z"
              />
            </svg>
          </div>
          <svg
            className="controls__play"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 250 250"
          >
            <g
              onClick={() =>
                !isPlayingEpisode
                  ? handleClick(episode.id, episode.podcastId)
                  : console.log("playing episode")
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
  }
}

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(ADD_TO_UPNEXT, { name: "addToUpnext" }),
    graphql(REMOVE_FROM_UPNEXT, { name: "removeFromUpnext" }),
    graphql(ADD_TO_FAVORITES, { name: "addToFavorites" }),
    graphql(REMOVE_FROM_FAVORITES, { name: "removeFromFavorites" })
  )(Episode)
);
