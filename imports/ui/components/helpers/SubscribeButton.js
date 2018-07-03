import React from "react";
import gql from "graphql-tag";
import { compose, graphql } from "react-apollo";
import { find } from "lodash";

const SUBSCRIBE = gql`
  mutation subscribe($_id: String!, $podcastId: Int!) {
    subscribe(_id: $_id, podcastId: $podcastId)
  }
`;

const UNSUBSCRIBE = gql`
  mutation unsubscribe($_id: String!, $podcastId: Int!) {
    unsubscribe(_id: $_id, podcastId: $podcastId)
  }
`;

const GET_SUBSCRIBED_PODCASTS = gql`
  query Podcasts($_id: String!) {
    podcasts(_id: $_id) {
      podcastId
    }
  }
`;

const SubscribeButton = ({
  _id,
  podcastId,
  subscribe,
  unsubscribe,
  loading,
  error,
  podcasts,
  refetch
}) => {
  if (loading) return null;
  if (error) return console.log(error);

  return (
    <div className="podcast__subscribe">
      {!find(podcasts, { podcastId }) ? (
        <button
          onClick={() => {
            subscribe({
              variables: {
                _id,
                podcastId
              },
              refetchQueries: [
                { query: GET_SUBSCRIBED_PODCASTS, variables: { _id } }
              ]
            }).then(() => console.log("subscribe"));
          }}
          className="subscribe-btn "
        />
      ) : (
        <button
          onClick={() => {
            unsubscribe({
              variables: {
                _id,
                podcastId
              },
              refetchQueries: [
                { query: GET_SUBSCRIBED_PODCASTS, variables: { _id } }
              ]
            }).then(() => console.log("unsubscribe"));
          }}
          className="subscribe-btn subscribe-btn--subscribed"
        />
      )}
    </div>
  );
};

export default compose(
  graphql(SUBSCRIBE, { name: "subscribe" }),
  graphql(UNSUBSCRIBE, { name: "unsubscribe" }),
  graphql(GET_SUBSCRIBED_PODCASTS, {
    options: { pollInterval: 5000 },
    props: ({ data: { loading, error, podcasts, refetch } }) => ({
      loading,
      error,
      podcasts,
      refetch
    })
  })
)(SubscribeButton);
