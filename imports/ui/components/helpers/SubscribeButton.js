import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { compose, graphql } from "react-apollo";
import { find } from "lodash";

import getSubscribedPodcastsIds from "./../../queries/getSubscribedPodcastsIds";
import subscribeToPodcast from "./../../queries/subscribeToPodcast";
import unsubscribeFromPodcast from "./../../queries/unsubscribeFromPodcast";

const SubscribeButton = ({
  podcastId,
  subscribe,
  unsubscribe,
  loading,
  error,
  podcasts,
  isLoggedIn
}) => {
  if (loading) return null;
  if (error) return null;
  if (!isLoggedIn) return null;

  return (
    <div className="podcast__subscribe">
      {!find(podcasts, { podcastId }) ? (
        <button
          onClick={() => {
            subscribe({
              variables: {
                podcastId
              },
              refetchQueries: [{ query: getSubscribedPodcastsIds }]
            }).then(() => console.log("subscribe"));
          }}
          className="subscribe-btn "
        />
      ) : (
        <button
          onClick={() => {
            unsubscribe({
              variables: {
                podcastId
              },
              refetchQueries: [{ query: getSubscribedPodcastsIds }]
            }).then(() => console.log("unsubscribe"));
          }}
          className="subscribe-btn subscribe-btn--subscribed"
        />
      )}
    </div>
  );
};

export default withTracker(() => {
  return { isLoggedIn: !!Meteor.userId() };
})(
  compose(
    graphql(subscribeToPodcast, { name: "subscribe" }),
    graphql(unsubscribeFromPodcast, { name: "unsubscribe" }),
    graphql(getSubscribedPodcastsIds, {
      skip: props => !props.isLoggedIn,
      options: { pollInterval: 5000 },
      props: ({ data: { loading, error, podcasts } }) => ({
        loading,
        error,
        podcasts
      })
    })
  )(SubscribeButton)
);
