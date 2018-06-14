import React from "react";
import Modal from "react-modal";
import moment from "moment";

const EpisodeModal = ({ isModalOpen, handleEpisodeModal, episode }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => handleEpisodeModal()}
      ariaHideApp={false}
      className="episode-modal"
      overlayClassName="episode-modal__overlay"
    >
      <div className="episode-modal__title">{episode.title}</div>
      <div className="episode-modal__author">{episode.author}</div>
      <div className="episode-modal__pub-date">
        Published
        {moment(episode.pubDate).format(" MMM D, YYYY")}
      </div>
      {episode.linkToEpisode ? (
        <a
          className="episode-modal__link-to-episode"
          href={episode.linkToEpisode}
          target="_blank"
        >
          Link to episode
        </a>
      ) : null}
      <div
        className="episode-modal__description"
        dangerouslySetInnerHTML={{
          __html: episode.description
        }}
      />
    </Modal>
  );
};

export default EpisodeModal;
