import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import { compose, graphql } from "react-apollo";
import { find, remove } from "lodash";

import LoginWarningModal from "./LoginWarningModal";
import UnsubscribeModal from "./UnsubscribeModal";

import getSubscribedPodcasts from "./../../queries/getSubscribedPodcasts";
import subscribeToPodcast from "./../../queries/subscribeToPodcast";
import unsubscribeFromPodcast from "./../../queries/unsubscribeFromPodcast";

class SubscribeButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isWarningModalOpne: false,
      isUnsubscribeModalOpen: false
    };

    this.closeWarningModal = this.closeWarningModal.bind(this);
    this.closeUnsubscribeModal = this.closeUnsubscribeModal.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  openWarningModal() {
    this.setState({ isWarningModalOpen: true });
  }

  closeWarningModal() {
    this.setState({ isWarningModalOpen: false });
  }

  openUnsubscribeModal() {
    this.setState({ isUnsubscribeModalOpen: true });
  }

  closeUnsubscribeModal() {
    this.setState({ isUnsubscribeModalOpen: false });
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
          data.podcasts
            ? data.podcasts.push(subscribe)
            : (data.podcasts = [subscribe]);
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
    const { podcastId, subscribed } = this.props;
    return (
      <div className="podcast__subscribe">
        {subscribed ? (
          <button
            onClick={() => {
              this.openUnsubscribeModal();
            }}
            className="subscribe-btn subscribe-btn--subscribed"
          />
        ) : (
          <button
            onClick={() => {
              this.subscribe(podcastId);
            }}
            className="subscribe-btn "
          />
        )}

        {this.state.isWarningModalOpen ? (
          <LoginWarningModal
            isModalOpen={this.state.isWarningModalOpen}
            closeWarningModal={this.closeWarningModal}
          />
        ) : null}

        {this.state.isUnsubscribeModalOpen ? (
          <UnsubscribeModal
            isModalOpen={this.state.isUnsubscribeModalOpen}
            closeUnsubscribeModal={this.closeUnsubscribeModal}
            unsubscribe={this.unsubscribe}
            podcastId={this.props.podcastId}
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
    graphql(unsubscribeFromPodcast, { name: "unsubscribe" })
  )(SubscribeButton)
);
