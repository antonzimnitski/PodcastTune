import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { compose, graphql } from "react-apollo";
import { find } from "lodash";
import LoginWarningModal from "./LoginWarningModal";

import getSubscribedPodcasts from "./../../queries/getSubscribedPodcasts";
import subscribeToPodcast from "./../../queries/subscribeToPodcast";
import unsubscribeFromPodcast from "./../../queries/unsubscribeFromPodcast";

class SubscribeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWarningModalOpne: false
    };

    this.closeWarningModal = this.closeWarningModal.bind(this);
  }

  openWarningModal() {
    this.setState({ isWarningModalOpen: true });
  }

  closeWarningModal() {
    this.setState({ isWarningModalOpen: false });
  }

  subscribe(podcastId) {
    const { subscribe, isLoggedIn } = this.props;

    if (!isLoggedIn) {
      this.openWarningModal();
      return;
    }

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
  }

  unsubscribe(podcastId) {
    const { unsubscribe } = this.props;

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
  }

  render() {
    const { podcastId, podcasts, error } = this.props;
    return (
      <div className="podcast__subscribe">
        {!find(podcasts, { podcastId }) ? (
          <button
            onClick={() => {
              this.subscribe(podcastId);
            }}
            className="subscribe-btn "
          />
        ) : (
          <button
            onClick={() => {
              this.unsubscribe(podcastId);
            }}
            className="subscribe-btn subscribe-btn--subscribed"
          />
        )}

        {this.state.isWarningModalOpen ? (
          <LoginWarningModal
            isModalOpen={this.state.isWarningModalOpen}
            closeWarningModal={this.closeWarningModal}
          />
        ) : null}
      </div>
    );
  }
}

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
