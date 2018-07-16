import React from "react";
import Modal from "react-modal";

const LoginWarningModal = ({ isModalOpen, closeWarningModal }) => {
  setTimeout(closeWarningModal, 3000);
  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={() => closeWarningModal()}
      ariaHideApp={false}
      className="warning-modal"
      overlayClassName="warning-modal__overlay"
    >
      <h2 className="warning-modal__header">Warning.</h2>
      <p className="warning-modal__text">
        Please log in or sign up to perform that action.
      </p>
    </Modal>
  );
};

export default LoginWarningModal;
