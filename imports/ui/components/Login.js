import React, { Component } from "react";
import { Meteor } from "meteor/meteor";
import PropTypes from "prop-types";

export class Login extends Component {
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

  // componentWillMount() {
  //   if (Meteor.userId()) {
  //     this.props.history.replace("/dashboard");
  //   }
  // }

  onSubmit(event) {
    event.preventDefault();

    let email = this.email.current.value.trim();
    let password = this.password.current.value.trim();

    Meteor.loginWithPassword({ email }, password, err => {
      const reason = err ? "Unable to login. Check email and password." : "";
      this.setState({ error: reason });
    });
  }

  render() {
    return (
      <React.Fragment>
        <h1 className="auth-modal__title">Login</h1>
        {this.state.error ? (
          <p className="auth-modal__error">{this.state.error}</p>
        ) : (
          undefined
        )}
        <form onSubmit={e => this.onSubmit(e)}>
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
          <button className="auth-modal__button">Login</button>
        </form>
        <button
          className="auth-modal__text-btn"
          onClick={() => this.props.onSwap()}
        >
          Don't have an account?
        </button>
      </React.Fragment>
    );
  }
}

// Login.propTypes = {
//   loginWithPassword: PropTypes.func.isRequired
// };

export default Login;

// export default withTracker(() => {
//   return {
//     loginWithPassword: Meteor.loginWithPassword
//   };
// })(Login);
