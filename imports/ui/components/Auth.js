import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import Modal from "react-modal";
import Login from "./Login";
import Signup from "./Signup";

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isSignupOpen: false,
      isLoginOpen: false,
      isLoggedIn: !!Meteor.userId()
    };

    this.closeAuthModal = this.closeAuthModal.bind(this);
    this.swapForms = this.swapForms.bind(this);
  }

  closeAuthModal() {
    this.setState({
      isModalOpen: false,
      isLoginOpen: false,
      isSignupOpen: false,
      isLoggedIn: true
    });
  }

  loginContent() {
    return (
      <React.Fragment>
        <div
          className="sidebar__link"
          onClick={() =>
            this.setState({
              isModalOpen: true,
              isLoginOpen: true
            })
          }
        >
          Sign In
        </div>
        <div
          className="sidebar__link"
          onClick={() =>
            this.setState({
              isModalOpen: true,
              isSignupOpen: true
            })
          }
        >
          Sing Up
        </div>
      </React.Fragment>
    );
  }

  logoutContent() {
    return (
      <div
        className="sidebar__link"
        onClick={() => {
          Meteor.logout();
          this.setState({ isLoggedIn: false });
        }}
      >
        Logout
      </div>
    );
  }

  modalContent() {
    if (this.state.isSignupOpen)
      return <Signup onClose={this.closeAuthModal} onSwap={this.swapForms} />;
    if (this.state.isLoginOpen)
      return <Login onClose={this.closeAuthModal} onSwap={this.swapForms} />;
  }

  swapForms() {
    this.setState({
      isSignupOpen: !this.state.isSignupOpen,
      isLoginOpen: !this.state.isLoginOpen
    });
  }

  render() {
    return (
      <div className="auth">
        {this.state.isLoggedIn ? this.logoutContent() : this.loginContent()}
        {this.state.isModalOpen ? (
          <Modal
            isOpen={this.state.isModalOpen}
            onRequestClose={() => this.closeAuthModal()}
            ariaHideApp={false}
            className="auth-modal"
            overlayClassName="auth-modal__overlay"
          >
            {this.modalContent()}
          </Modal>
        ) : null}
      </div>
    );
  }
}

export default Auth;
