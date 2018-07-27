import React from "react";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Query } from "react-apollo";

import InnerHeader from "./InnerHeader";
import Feed from "./Feed";
import Loader from "./helpers/Loader";

import getInProgress from "./../queries/getInProgress";

const InProgress = ({ title, isLoggedIn }) => {
  return (
    <React.Fragment>
      <InnerHeader title={title} />
      <div className="in-progress">
        {isLoggedIn ? (
          renderInProgress()
        ) : (
          <div className="in-progress__content">
            <h2>To see your in progress episodes Login or Signup.</h2>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
function renderInProgress() {
  return (
    <Query query={getInProgress} pollInterval={30000}>
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) {
          return (
            <div>Sorry! There was an error loading In Progress episodes.</div>
          );
        }

        if (!data || !data.inProgress || !data.inProgress.length) {
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
        const filterFeed = data.inProgress.filter(episode => !episode.isPlayed);

        return <Feed feed={filterFeed} />;
      }}
    </Query>
  );
}

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(InProgress);
