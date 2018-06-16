import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: ""
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  // componentWillMount() {
  //   if (Meteor.userId()) {
  //     this.props.history.replace("/dashboard");
  //   }
  // }

  onSubmit(event) {
    event.preventDefault();

    let email = this.refs.email.value.trim();
    let password = this.refs.password.value.trim();

    this.props.loginWithPassword({ email }, password, err => {
      const reason = err ? "Unable to login. Check email and password." : "";
      this.setState({ error: reason });
    });
  }

  render() {
    return (
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h1>Login</h1>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
          <form className="boxed-view__form" onSubmit={this.onSubmit}>
            <input type="email" ref="email" name="email" placeholder="Email" />
            <input
              type="password"
              ref="password"
              name="password"
              placeholder="Password"
            />
            <button className="button">Login</button>
          </form>
          <button onClick={() => this.props.onSwap()}>
            Don't have an account?
          </button>
        </div>
      </div>
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
