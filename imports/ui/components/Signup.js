import React, { Component } from "react";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";

export class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };

    this.email = React.createRef();
    this.password = React.createRef();
  }

  componentDidMount() {
    this.email.current.focus();
  }

  onSubmit(event) {
    event.preventDefault();

    let email = this.email.current.value.trim();
    let password = this.password.current.value.trim();

    if (password.length < 9) {
      return this.setState({
        error: "Password must be more than 8 characters long"
      });
    }

    Accounts.createUser({ email, password }, err => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: "" });
        this.props.onClose();
      }
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="auth-modal__title">Join</h1>
        {this.state.error ? (
          <p className="auth-modal__error">{this.state.error}</p>
        ) : (
          undefined
        )}
        <form onSubmit={e => this.onSubmit(e)} noValidate>
          <label className="auth-modal__label" htmlFor="email">
            Email: *
          </label>
          <input
            type="email"
            ref={this.email}
            id="email"
            name="email"
            placeholder="Email"
            className="auth-modal__input"
          />

          <label className="auth-modal__label" htmlFor="password">
            Password: *
          </label>
          <input
            type="password"
            ref={this.password}
            id="password"
            name="password"
            placeholder="Password"
            className="auth-modal__input"
          />
          <button className="auth-modal__button">Create Account</button>
        </form>
        <button
          className="auth-modal__text-btn"
          onClick={() => this.props.onSwap()}
        >
          Have an account?
        </button>
      </React.Fragment>
    );
  }
}

// Signup.propTypes = {
//   createUser: PropTypes.func.isRequired
// };

export default Signup;
// export default withTracker(() => {
//   return {
//     createUser: Accounts.createUser
//   };
// })(Signup);
