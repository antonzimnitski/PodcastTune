import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";
import fetchGenres from "./../queries/fetchGenres";

class Discover extends Component {
  renderGenres(arr) {
    return (
      <div className="discover__group">
        {arr.map(({ id, name, subgenres }) => {
          return (
            <div key={id}>
              <Link to={`discover/${id}`}>{name}</Link>
              {subgenres ? this.renderGenres(subgenres) : null}
            </div>
          );
        })}
      </div>
    );
  }

  render() {
    const content = this.props.data.loading ? (
      <Loader />
    ) : (
      <div>{this.renderGenres(this.props.data.genres)}</div>
    );

    return (
      <div>
        <InnerHeader title={this.props.title} />
        {content}
      </div>
    );
  }
}

export default graphql(fetchGenres)(Discover);
