import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { find } from "lodash";

const SUBSCRIBE = gql`
  mutation subscribe($podcastId: Int!) {
    subscribe(podcastId: $podcastId)
  }
`;

const UNSUBSCRIBE = gql`
  mutation unsubscribe($podcastId: Int!) {
    unsubscribe(podcastId: $podcastId)
  }
`;

const GET_SUBSCRIBED_PODCASTS = gql`
  query Podcasts {
    podcasts {
      podcastId
    }
  }
`;

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
  if (error) return console.log(error);
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
              refetchQueries: [{ query: GET_SUBSCRIBED_PODCASTS }]
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
              refetchQueries: [{ query: GET_SUBSCRIBED_PODCASTS }]
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
    graphql(SUBSCRIBE, { name: "subscribe" }),
    graphql(UNSUBSCRIBE, { name: "unsubscribe" }),
    graphql(GET_SUBSCRIBED_PODCASTS, {
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
