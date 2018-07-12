import React from "react";
import Modal from "react-modal";
import moment from "moment";
import { Query } from "react-apollo";

import getEpisodeInfo from "./../../queries/getEpisodeInfo";

const EpisodeModal = ({ isModalOpen, handleEpisodeModal, podcastId, id }) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => handleEpisodeModal()}
      ariaHideApp={false}
      className="episode-modal"
      overlayClassName="episode-modal__overlay"
    >
      <Query
        query={getEpisodeInfo}
        variables={{
          podcastId,
          id
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error || !data.episode) throw error;

          const {
            title,
            author,
            pubDate,
            linkToEpisode,
            description
          } = data.episode;

          return (
            <>
              <div className="episode-modal__title">{title}</div>
              <div className="episode-modal__author">{author}</div>
              <div className="episode-modal__pub-date">
                Published
                {moment(pubDate).format(" MMM D, YYYY")}
              </div>
              {linkToEpisode ? (
                <a
                  className="episode-modal__link-to-episode"
                  href={linkToEpisode}
                  target="_blank"
                >
                  Link to episode
                </a>
              ) : null}
              <div
                className="episode-modal__description"
                dangerouslySetInnerHTML={{
                  __html: description
                }}
              />
            </>
          );
        }}
      </Query>
    </Modal>
  );
};

export default EpisodeModal;
