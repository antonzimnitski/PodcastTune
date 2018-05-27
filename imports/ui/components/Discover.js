import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Link } from "react-router-dom";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";
import fetchGenres from "./../queries/fetchGenres";

class Discover extends Component {
  renderGenres(arr) {
    return (
      <ul className="genre-nav">
        {arr.map(({ id, name, subgenres }) => {
          return (
            <li className="genre-nav__group" key={id}>
              <Link
                title={name}
                className="genre-nav__group-title"
                to={`discover/${id}`}
              >
                {name}
              </Link>
              {subgenres.length !== 0 ? (
                <ul className="genre-nav__subgenre-group">
                  {subgenres.map(el => {
                    return (
                      <li key={el.id}>
                        <Link
                          className="genre-nav__subgenre-item"
                          to={`discover/${el.id}`}
                        >
                          {el.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    );
  }
  // {subgenres ? this.renderGenres(subgenres) : null}

  render() {
    const content = this.props.data.loading ? (
      <Loader />
    ) : (
      this.renderGenres(this.props.data.genres)
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
