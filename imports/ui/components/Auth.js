import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import Modal from "react-modal";
import Login from "./Login";
import Signup from "./Signup";
import { Query, withApollo } from "react-apollo";
import getLoggedUser from "./../queries/getLoggedUser";

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
      <Query query={getLoggedUser} skip={!this.state.isLoggedIn}>
        {({ loading, error, data }) => {
          if (loading) return null;
          if (error) throw error;
          console.log(data);

          return (
            <React.Fragment>
              <div className="sidebar__link">{data.user.email}</div>
              <div
                className="sidebar__link"
                onClick={() => {
                  Meteor.logout();
                  this.setState({ isLoggedIn: false }, () => {
                    this.props.client.resetStore();
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
        {console.log(this.props)}
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

export default withApollo(Auth);
