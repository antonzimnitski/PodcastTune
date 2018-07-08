import React from "react";
import InnerHeader from "./InnerHeader";
import { withTracker } from "meteor/react-meteor-data";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Feed from "./Feed";

const Favorites = ({ title, isLoggedIn }) => {
  return (
    <div className="favorites">
      <InnerHeader title={title} />

      {isLoggedIn ? (
        renderFavorites()
      ) : (
        <div className="favorites__content">
          <h2>To see your in favorite episodes Login or Signup.</h2>
        </div>
      )}
    </div>
  );
};

function renderFavorites() {
  return (
    <Query query={GET_FAVORITES} pollInterval={5000}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) return null;

        if (!data || !data.favorites || data.favorites.length === 0) {
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

const GET_FAVORITES = gql`
  query Favorites {
    favorites {
      id
      podcastId
      podcastArtworkUrl
      duration
      title
      author
    }
  }
`;

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(Favorites);
