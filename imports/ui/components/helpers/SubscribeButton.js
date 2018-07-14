import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { compose, graphql } from "react-apollo";
import { find } from "lodash";

import getSubscribedPodcasts from "./../../queries/getSubscribedPodcasts";
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
              update: (proxy, { data: { subscribe } }) => {
                try {
                  const data = proxy.readQuery({
                    query: getSubscribedPodcasts
                  });
                  data.podcasts.push(subscribe);
                  proxy.writeQuery({ query: getSubscribedPodcasts, data });
                } catch (e) {
                  console.log("query haven't been called", e);
                }
              }
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
              update: (proxy, { data: { unsubscribe } }) => {
                try {
                  const data = proxy.readQuery({
                    query: getSubscribedPodcasts
                  });
                  remove(data.podcasts, n => n.id === unsubscribe.id);
                  proxy.writeQuery({ query: getSubscribedPodcasts, data });
                } catch (e) {
                  console.log("query haven't been called", e);
                }
              }
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
    graphql(getSubscribedPodcasts, {
      skip: props => !props.isLoggedIn,
      options: { pollInterval: 10000 },
      props: ({ data: { loading, error, podcasts } }) => ({
        loading,
        error,
        podcasts
      })
    })
  )(SubscribeButton)
);
