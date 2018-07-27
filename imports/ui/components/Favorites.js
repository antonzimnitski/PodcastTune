import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Query } from "react-apollo";

import InnerHeader from "./InnerHeader";
import Feed from "./Feed";
import Loader from "./helpers/Loader";

import getFavorites from "./../queries/getFavorites";

const Favorites = ({ title, isLoggedIn }) => {
  return (
    <React.Fragment>
      <InnerHeader title={title} />
      <div className="favorites">
        {isLoggedIn ? (
          renderFavorites()
        ) : (
          <div className="favorites__content">
            <h2>To see your in favorite episodes Login or Signup.</h2>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

function renderFavorites() {
  return (
    <Query query={getFavorites} pollInterval={30000}>
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) {
          return (
            <div>
              Sorry! There was an error loading yout favourite episodes.
            </div>
          );
        }

        if (!data || !data.favorites || !data.favorites.length) {
          return (
            <div className="favorites__content">
              <h2>No favorites episodes available.</h2>
              <div>It's time to find some new favourites.</div>
            </div>
          );
        }

        return <Feed feed={data.favorites} />;
      }}
    </Query>
  );
}

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(Favorites);
