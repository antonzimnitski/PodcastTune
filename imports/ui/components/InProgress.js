import React from "react";
import { Link } from "react-router-dom";
import InnerHeader from "./InnerHeader";
import { withTracker } from "meteor/react-meteor-data";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import Feed from "./Feed";
import Loader from "./helpers/Loader";

const InProgress = ({ title, isLoggedIn }) => {
  return (
    <div className="in-progress">
      <InnerHeader title={title} />

      {isLoggedIn ? (
        renderInProgress()
      ) : (
        <div className="in-progress__content">
          <h2>To see your in progress episodes Login or Signup.</h2>
        </div>
      )}
    </div>
  );
};
function renderInProgress() {
  return (
    <Query query={GET_IN_PROGRESS} pollInterval={5000}>
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) return null;

        if (!data || !data.inProgress || data.inProgress.length === 0) {
          return (
            <div className="in-progress__content">
              <h2>No episodes in progress.</h2>
              <div>
                Press play on <Link to="/discover">something new</Link>. You
                know you want to.
              </div>
            </div>
          );
        }

        return <Feed feed={data.inProgress} />;
        /* if (!episode) return;
          return (
            <Link to={`/podcasts/${podcast.podcastId}`} key={podcast.podcastId}>
              <img src={podcast.artworkUrl} alt="" />
            </Link>
          ); */
      }}
    </Query>
  );
}

const GET_IN_PROGRESS = gql`
  query InProgress {
    inProgress {
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
})(InProgress);
