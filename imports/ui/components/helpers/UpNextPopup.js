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

import getLocalUpnext from "./../../../localData/queries/getLocalUpnext";

const UpNextPopup = ({
  isModalOpen,
  handleUpNextPopup,
  upnext,
  localUpnext,
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

  const episodes = upnext || localUpnext;

  const content =
    !episodes || !episodes.length ? (
      <div className="up-next__empty">
        <h2 className="up-next__title">Your Up Next is Empty</h2>
        <p className="empty__text">Add some episodes</p>
      </div>
    ) : (
      <div className="modal__list">
        {episodes.map(episode => {
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
      skip: props => !props.isLoggedIn,
      props: ({ data: { upnext } }) => ({
        upnext
      })
    }),
    graphql(setPlayingEpisode, {
      skip: props => !props.isLoggedIn,
      name: "setPlayingEpisode"
    }),
    graphql(removeFromUpnext, {
      skip: props => !props.isLoggedIn,
      name: "removeFromUpnext"
    }),
    graphql(getLocalUpnext, {
      skip: props => props.isLoggedIn,
      props: ({ data: { localUpnext } }) => ({
        localUpnext
      })
    }),
    graphql(setPlayingEpisode, {
      skip: props => !props.isLoggedIn,
      name: "setPlayingEpisode"
    }),
    graphql(removeFromUpnext, {
      skip: props => !props.isLoggedIn,
      name: "removeFromUpnext"
    })
  )(UpNextPopup)
);
