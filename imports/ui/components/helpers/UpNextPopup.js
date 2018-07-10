import React from "react";
import ModalItem from "./ModalItem";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

const UpNextPopup = ({
  upnext,
  isLoggedIn,
  setPlayingEpisode,
  removeFromUpnext
}) => {
  const handleClick = (id, podcastId) => {
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
  };

  const handleRemove = (id, podcastId) => {
    isLoggedIn
      ? removeFromUpnext({
          variables: {
            id,
            podcastId
          },
          refetchQueries: [{ query: GET_UPNEXT }]
        })
          .then(res => console.log("Episode removed from upnext", res.data))
          .catch(err => console.log(err))
      : console.log("todo 'remove from upnext'", id, podcastId);
  };

  if (!upnext || upnext.length === 0) {
    return (
      <div className="up-next__empty">
        <h2 className="up-next__title">Your Up Next is Empty</h2>
        <p className="empty__text">Add some episodes</p>
      </div>
    );
  }
  return (
    <React.Fragment>
      <h2 className="up-next__title">Up Next</h2>
      <div className="modal__list">
        {upnext.map(episode => {
          if (!episode) return;
          return (
            <div key={episode.id} className="modal__item">
              <ModalItem item={episode} playIcon={true} onClick={handleClick} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 192.33 192.33"
                className="modal__remove"
              >
                <g onClick={() => handleRemove(episode.id, episode.podcastId)}>
                  <path d="M96.17 126.57l-65.06 65.06-30.4-30.41 65.05-65.05L.71 31.11 31.11.71l65.06 65.05L161.22.71l30.41 30.4-65.06 65.06 65.06 65.05-30.41 30.41-65.05-65.06z" />
                  <path d="M161.22 1.41l29.7 29.7-64.35 64.35-.7.71.7.7 64.35 64.35-29.7 29.7-64.35-64.35-.7-.7-.71.7-64.35 64.35-29.7-29.7 64.35-64.35.71-.7-.71-.71L1.41 31.11l29.7-29.7 64.35 64.35.71.71.7-.71 64.35-64.35m0-1.41l-65 65.05L31.11 0 0 31.11l65.05 65.06L0 161.22l31.11 31.11 65.06-65.05 65.05 65.05 31.11-31.11-65.05-65 65.05-65.06L161.22 0z" />
                </g>
              </svg>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

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

const REMOVE_FROM_UPNEXT = gql`
  mutation RemoveFromUpnext($id: String!, $podcastId: Int!) {
    removeFromUpnext(podcastId: $podcastId, id: $id) {
      id
      podcastId
    }
  }
`;

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(GET_UPNEXT, {
      props: ({ data: { upnext } }) => ({
        upnext
      })
    }),
    graphql(SET_PLAYING_EPISODE, { name: "setPlayingEpisode" }),
    graphql(REMOVE_FROM_UPNEXT, { name: "removeFromUpnext" })
  )(UpNextPopup)
);
