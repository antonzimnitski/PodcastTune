import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

import fetchGenres from "./../queries/fetchGenres";

class Discover extends Component {
  renderGenres(arr) {
    return (
      <ul>
        {arr.map(({ id, name, subgenres }) => {
          return (
            <li key={id}>
              <Link to={`discover/${id}`}>{name}</Link>
              {subgenres ? this.renderGenres(subgenres) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    if (this.props.data.loading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <div>{this.renderGenres(this.props.data.genres)}</div>
      </div>
    );
  }
}

export default graphql(fetchGenres)(Discover);
