import React from "react";
import Modal from "react-modal";

const UnsubscribeModal = ({
  isModalOpen,
  closeUnsubscribeModal,
  unsubscribe,
  podcastId
}) => {
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => closeUnsubscribeModal()}
      ariaHideApp={false}
      className="unsubscribe-modal"
      overlayClassName="unsubscribe-modal__overlay"
    >
      <h2 className="unsubscribe-modal__header">Are you sure?</h2>
      <div className="unsubscribe-modal__controls">
        <button onClick={() => closeUnsubscribeModal()} className="button">
          Cancel
        </button>

        <button
          onClick={() => {
            unsubscribe(podcastId);
            closeUnsubscribeModal();
          }}
          className="button button--danger"
        >
          Unsubscribe
        </button>
      </div>
    </Modal>
  );
};

export default UnsubscribeModal;
