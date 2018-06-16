import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

export class Signup extends Component {
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

    if (password.length < 9) {
      return this.setState({
        error: "Password must be more than 8 characters long"
      });
    }

    this.props.createUser({ email, password }, err => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: "" });
      }
    });
  }

  render() {
    return (
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h1>Join</h1>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
          <form
            className="boxed-view__form"
            onSubmit={this.onSubmit}
            noValidate
          >
            <input type="email" ref="email" name="email" placeholder="Email" />
            <input
              type="password"
              ref="password"
              name="password"
              placeholder="Password"
            />
            <button className="button">Create Account</button>
          </form>
          <button onClick={() => this.props.onSwap()}>Have an account?</button>
        </div>
      </div>
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
