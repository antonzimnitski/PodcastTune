import React from "react";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Query } from "react-apollo";

import InnerHeader from "./InnerHeader";
import Loader from "./helpers/Loader";
import Feed from "./Feed";

import getNewReleases from "./../queries/getNewReleases";

const NewReleases = ({ title, isLoggedIn }) => {
  return (
    <React.Fragment>
      <InnerHeader title={title} />
      <div className="new-releases">
        {isLoggedIn ? (
          renderNewReleases()
        ) : (
          <div className="new-releases__content">
            <h2>
              To see new episodes of your subscribed podcasts Login or Signup.
            </h2>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

function renderNewReleases() {
  return (
    <Query query={getNewReleases} pollInterval={10000}>
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) {
          return <div>Sorry! There was an error loading New Releases.</div>;
        }

        if (!data || !data.newReleases || !data.newReleases.length) {
          return (
            <div className="new-releases__content">
              <h2>All caught up!.</h2>
              <div>
                It's time to subscribe to some{" "}
                <Link to="/discover">more podcasts</Link>.
              </div>
            </div>
          );
        }

        const feed = data.newReleases.filter(el => !el.isPlayed);

        return <Feed feed={feed} />;
      }}
    </Query>
  );
}

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(NewReleases);
