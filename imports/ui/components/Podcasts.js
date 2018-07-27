import React from "react";
import { Link } from "react-router-dom";
import { withTracker } from "meteor/react-meteor-data";
import { Query } from "react-apollo";

import Loader from "./helpers/Loader";
import InnerHeader from "./InnerHeader";

import getSubscribedPodcasts from "./../queries/getSubscribedPodcasts";

const Podcasts = ({ title, isLoggedIn }) => {
  return (
    <React.Fragment>
      <InnerHeader title={title} />
      <div className="podcasts">
        {isLoggedIn ? (
          renderPodcasts()
        ) : (
          <div className="podcasts__content">
            <h2>To see your subscribed podcasts Login or Signup.</h2>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

function renderPodcasts() {
  return (
    <Query query={getSubscribedPodcasts} pollInterval={30000}>
      {({ loading, error, data }) => {
        if (loading) return <Loader />;
        if (error) {
          return (
            <div>
              Sorry! There was an error loading your Sunscribed Podcasts.
            </div>
          );
        }

        if (!data || !data.podcasts || !data.podcasts.length) {
          return (
            <div className="podcasts__content">
              <h2>Oh no! It's empty!</h2>
              <div>
                Head to <Link to="/discover">Discover section</Link>, to find
                something you interested in.
              </div>
            </div>
          );
        }

        const podcasts = data.podcasts.map(podcast => {
          if (!podcast) return;
          return (
            <div key={podcast.podcastId} className="podcasts__card">
              <Link to={`/podcasts/${podcast.podcastId}`}>
                <img
                  className="podcasts__image"
                  src={podcast.artworkUrl}
                  alt=""
                />
              </Link>
            </div>
          );
        });
        return <div className="podcasts__cards">{podcasts}</div>;
      }}
    </Query>
  );
}

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(Podcasts);
