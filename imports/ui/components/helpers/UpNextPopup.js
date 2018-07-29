import React from "react";
import { withApollo, compose, graphql } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";
import Modal from "react-modal";
import { removeFromCache } from "./../../utils/apolloCache";

import ModalItem from "./ModalItem";
import Loader from "./Loader";

// Queries for logged user
import getUpnext from "./../../queries/getUpnext";
import getPlayingEpisode from "./../../queries/getPlayingEpisode";

// Mutations for logged user
import setPlayingEpisode from "./../../mutations/setPlayingEpisode";
import removeFromUpnext from "./../../mutations/removeFromUpnext";

// Queries for local state
import getLocalUpnext from "./../../../localData/queries/getLocalUpnext";
import getLocalPlayingEpisode from "./../../../localData/queries/getLocalPlayingEpisode";

// Mutations for local state
import setLocalPlayingEpisode from "./../../../localData/mutations/setLocalPlayingEpisode";
import removeFromLocalUpnext from "./../../../localData/mutations/removeFromLocalUpnext";

const UpNextPopup = ({
  loading,
  isModalOpen,
  handleUpNextPopup,
  upnext,
  localUpnext,
  isLoggedIn,
  setPlayingEpisode,
  removeFromUpnext,
  setLocalPlayingEpisode,
  removeFromLocalUpnext,
  client
}) => {
  const handleClick = (id, podcastId) => {
    isLoggedIn
      ? setPlayingEpisode({
          variables: { id, podcastId },
          refetchQueries: [{ query: getPlayingEpisode }, { query: getUpnext }]
        }).catch(err => console.log("Error in setPlayingEpisode", err))
      : setLocalPlayingEpisode({
          variables: { id, podcastId },
          refetchQueries: [
            { query: getLocalPlayingEpisode },
            { query: getLocalUpnext }
          ]
        }).catch(err => console.log("Error in setLocalPlayingEpisode", err));
  };

  const handleRemove = (event, id, podcastId) => {
    event.stopPropagation();
    isLoggedIn
      ? removeFromUpnext({
          variables: { id, podcastId },
          update: (proxy, { data: { removeFromUpnext } }) => {
            removeFromCache(
              proxy,
              client,
              getUpnext,
              "upnext",
              removeFromUpnext
            );
          }
        }).catch(err => console.log("Error in removeFromUpnext", err))
      : removeFromLocalUpnext({
          variables: { id, podcastId }
        }).catch(err => console.log("Error in removeFromUpnext", err));
  };

  const renderContent = episodes => {
    return !episodes || !episodes.length ? (
      <div className="up-next__empty">
        <h2 className="up-next__title">Your Up Next is Empty</h2>
        <p className="empty__text">Add some episodes</p>
      </div>
    ) : (
      <div className="modal__list">
        {episodes.map(episode => {
          if (!episode) return;

          const { id, podcastId } = episode;

          return (
            <div
              key={id}
              className="modal__item"
              onClick={() => handleClick(id, podcastId)}
            >
              <ModalItem item={episode} playIcon={true} />
              <div
                className="modal__remove"
                onClick={event => handleRemove(event, id, podcastId)}
              />
            </div>
          );
        })}
      </div>
    );
  };

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
      {loading ? <Loader /> : renderContent(upnext || localUpnext)}
    </Modal>
  );
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(getUpnext, {
      skip: props => !props.isLoggedIn,
      props: ({ data: { upnext, loading } }) => ({
        upnext,
        loading
      })
    }),
    graphql(getLocalUpnext, {
      skip: props => props.isLoggedIn,
      props: ({ data: { localUpnext, loading } }) => ({
        localUpnext,
        loading
      })
    }),
    graphql(setPlayingEpisode, { name: "setPlayingEpisode" }),
    graphql(removeFromUpnext, { name: "removeFromUpnext" }),
    graphql(setLocalPlayingEpisode, { name: "setLocalPlayingEpisode" }),
    graphql(removeFromLocalUpnext, { name: "removeFromLocalUpnext" })
  )(withApollo(UpNextPopup))
);
