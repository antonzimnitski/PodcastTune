import React from "react";
import { compose, graphql } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { remove } from "lodash";

import ModalItem from "./ModalItem";

import removeFromUpnext from "./../../queries/removeFromUpnext";
import getUpnext from "./../../queries/getUpnext";
import getPlayingEpisode from "./../../queries/getPlayingEpisode";
import setPlayingEpisode from "./../../queries/setPlayingEpisode";

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
          refetchQueries: [{ query: getPlayingEpisode }, { query: getUpnext }]
        })
          .then(res => console.log("success", res.data))
          .catch(err => console.log(err))
      : console.log("todo it later", id, podcastId);
  };

  const handleRemove = (event, id, podcastId) => {
    event.stopPropagation();
    isLoggedIn
      ? removeFromUpnext({
          variables: {
            id,
            podcastId
          },
          update: (proxy, { data: { removeFromUpnext } }) => {
            try {
              const data = proxy.readQuery({ query: getUpnext });
              remove(data.upnext, n => n.id === removeFromUpnext.id);
              proxy.writeQuery({ query: getUpnext, data });
            } catch (e) {
              console.log("query haven't been called", e);
            }
          }
        }).catch(err => console.log(err))
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
            <div
              key={episode.id}
              className="modal__item"
              onClick={() => handleClick(episode.id, episode.podcastId)}
            >
              <ModalItem item={episode} playIcon={true} />
              <div
                className="modal__remove"
                onClick={event =>
                  handleRemove(event, episode.id, episode.podcastId)
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 192.33 192.33"
                >
                  <path d="M96.17 126.57l-65.06 65.06-30.4-30.41 65.05-65.05L.71 31.11 31.11.71l65.06 65.05L161.22.71l30.41 30.4-65.06 65.06 65.06 65.05-30.41 30.41-65.05-65.06z" />
                  <path d="M161.22 1.41l29.7 29.7-64.35 64.35-.7.71.7.7 64.35 64.35-29.7 29.7-64.35-64.35-.7-.7-.71.7-64.35 64.35-29.7-29.7 64.35-64.35.71-.7-.71-.71L1.41 31.11l29.7-29.7 64.35 64.35.71.71.7-.71 64.35-64.35m0-1.41l-65 65.05L31.11 0 0 31.11l65.05 65.06L0 161.22l31.11 31.11 65.06-65.05 65.05 65.05 31.11-31.11-65.05-65 65.05-65.06L161.22 0z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(getUpnext, {
      props: ({ data: { upnext } }) => ({
        upnext
      })
    }),
    graphql(setPlayingEpisode, { name: "setPlayingEpisode" }),
    graphql(removeFromUpnext, { name: "removeFromUpnext" })
  )(UpNextPopup)
);
