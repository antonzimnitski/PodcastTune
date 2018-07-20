import React from "react";
import { compose, graphql } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import { remove } from "lodash";
import Modal from "react-modal";

import ModalItem from "./ModalItem";

import removeFromUpnext from "./../../queries/removeFromUpnext";
import getUpnext from "./../../queries/getUpnext";
import getPlayingEpisode from "./../../queries/getPlayingEpisode";
import setPlayingEpisode from "./../../queries/setPlayingEpisode";

const UpNextPopup = ({
  isModalOpen,
  handleUpNextPopup,
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

  const content =
    !upnext || !upnext.length ? (
      <div className="up-next__empty">
        <h2 className="up-next__title">Your Up Next is Empty</h2>
        <p className="empty__text">Add some episodes</p>
      </div>
    ) : (
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
              />
            </div>
          );
        })}
      </div>
    );

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => handleUpNextPopup()}
      ariaHideApp={false}
      className="up-next__popup"
      overlayClassName="up-next__popup-overlay"
    >
      <div className="modal__header">
        <h2 className="modal__title">Up Next</h2>
        <div className="modal__close" onClick={() => handleUpNextPopup()} />
      </div>
      {content}
    </Modal>
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
