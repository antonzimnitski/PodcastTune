import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import Modal from "react-modal";
import { Query, withApollo } from "react-apollo";
import { withTracker } from "meteor/react-meteor-data";

import Login from "./Login";
import Signup from "./Signup";

import getLoggedUser from "./../queries/getLoggedUser";

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isModalOpen: false,
      isSignupOpen: false,
      isLoginOpen: false
    };

    this.closeAuthModal = this.closeAuthModal.bind(this);
    this.swapForms = this.swapForms.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
  }

  closeAuthModal() {
    this.setState({
      isModalOpen: false,
      isLoginOpen: false,
      isSignupOpen: false
    });
  }

  onSuccess() {
    this.closeAuthModal();
  }

  loginContent() {
    return (
      <React.Fragment>
        <div
          className="sidebar__link"
          onClick={() =>
            this.setState(
              {
                isModalOpen: true,
                isLoginOpen: true
              },
              () => {
                this.props.closeSidebar();
              }
            )
          }
        >
          Sign In
        </div>
        <div
          className="sidebar__link"
          onClick={() =>
            this.setState(
              {
                isModalOpen: true,
                isSignupOpen: true
              },
              () => {
                this.props.closeSidebar();
              }
            )
          }
        >
          Sing Up
        </div>
      </React.Fragment>
    );
  }

  logoutContent() {
    return (
      <Query query={getLoggedUser}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) throw error;

          return (
            <React.Fragment>
              <div className="sidebar__link">{data.user.email}</div>
              <div
                className="sidebar__link"
                onClick={() => {
                  Meteor.logout(() => {
                    this.props.client.resetStore();
                    this.props.closeSidebar();
                  });
                }}
              >
                Logout
              </div>
            </React.Fragment>
          );
        }}
      </Query>
    );
  }

  modalContent() {
    if (this.state.isSignupOpen)
      return (
        <Signup
          onClose={this.closeAuthModal}
          onSuccess={this.onSuccess}
          onSwap={this.swapForms}
        />
      );
    if (this.state.isLoginOpen)
      return (
        <Login
          onClose={this.closeAuthModal}
          onSuccess={this.onSuccess}
          onSwap={this.swapForms}
        />
      );
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
        {this.props.isLoggedIn ? this.logoutContent() : this.loginContent()}
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

export default withApollo(
  withTracker(() => {
    return { isLoggedIn: !!Meteor.userId() };
  })(Auth)
);
