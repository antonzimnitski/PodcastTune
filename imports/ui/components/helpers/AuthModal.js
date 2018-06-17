import React, { Component } from "react";

import Login from "./../Login";
import Signup from "./../Signup";

class AuthModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignupOpen: this.props.isSignupOpen,
      isLoginOpen: this.props.isLoginOpen
    };

    this.swapForms = this.swapForms.bind(this);
  }

  swapForms() {
    this.setState({
      isSignupOpen: !this.state.isSignupOpen,
      isLoginOpen: !this.state.isLoginOpen
    });
  }

  render() {
    const { isSignupOpen, isLoginOpen } = this.state;
    return (
      <React.Fragment>
        {isSignupOpen ? <Signup onSwap={this.swapForms} /> : null}
        {isLoginOpen ? <Login onSwap={this.swapForms} /> : null}
      </React.Fragment>
    );
  }
}

export default AuthModal;
