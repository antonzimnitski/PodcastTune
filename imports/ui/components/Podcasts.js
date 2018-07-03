import React from "react";
import { Link } from "react-router-dom";
import InnerHeader from "./InnerHeader";
import { withTracker } from "meteor/react-meteor-data";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const Podcasts = ({ title, isLoggedIn }) => {
  return (
    <div className="podcasts">
      <InnerHeader title={title} />

      {isLoggedIn ? (
        renderPodcasts()
      ) : (
        <h2>To see your subscribed podcasts Login or Signup.</h2>
      )}
    </div>
  );
};

function renderPodcasts() {
  return (
    <Query query={GET_USER}>
      {({ loading, error, data }) => {
        if (loading) return null;
        if (error) throw error;

        return (
          <Query
            query={GET_SUBSCRIBED_PODCASTS}
            variables={{ _id: data.user._id }}
            pollInterval={5000}
          >
            {({ loading, error, data }) => {
              if (loading) return null;
              if (error) throw error;

              if (!data || !data.podcasts || data.podcasts.length === 0) {
                return (
                  <div className="podcasts__content">
                    <h2>Oh no! It's empty!</h2>
                    <div>
                      Head to <Link to="/discover">Discover section</Link>, to
                      find something you interested in.
                    </div>
                  </div>
                );
              }

              return data.podcasts.map(podcast => {
                if (!podcast) return;
                return (
                  <Link
                    to={`/podcasts/${podcast.podcastId}`}
                    key={podcast.podcastId}
                  >
                    <img src={podcast.artworkUrl} alt="" />
                  </Link>
                );
              });
            }}
          </Query>
        );
      }}
    </Query>
  );
}

const GET_SUBSCRIBED_PODCASTS = gql`
  query Podcasts($_id: String!) {
    podcasts(_id: $_id) {
      podcastId
      artworkUrl
    }
  }
`;

const GET_USER = gql`
  query {
    user {
      _id
    }
  }
`;

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(Podcasts);
