import React, { Component } from "react";
import { graphql } from "react-apollo";

import fetchGenres from "./../queries/fetchGenres";

class Discover extends Component {
  renderGenres(arr) {
    return (
      <ul>
        {arr.map(genre => {
          return (
            <li key={genre.id}>
              {genre.name}
              {genre.subgenres ? this.renderGenres(genre.subgenres) : null}
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
