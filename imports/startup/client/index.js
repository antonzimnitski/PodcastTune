import "core-js/es6";

import { Meteor } from "meteor/meteor";
import React from "react";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";
import { render } from "react-dom";
import { merge } from "lodash";
import {
  HttpLink,
  InMemoryCache,
  ApolloLink,
  defaultDataIdFromObject
} from "apollo-boost";
import { persistCache } from "apollo-cache-persist";
import { ApolloProvider } from "react-apollo";
import "whatwg-fetch";
import ApolloClient from "apollo-client";

import {
  queueSplice,
  setStorageValue,
  getStorageValue
} from "./../../ui/utils/utils";

import App from "./../../ui/components/App";
import { withClientState } from "apollo-link-state";

import playingEpisode from "./../../resolvers/playingEpisode";

const httpLink = new HttpLink({
  uri: Meteor.absoluteUrl("graphql")
});

const authLink = new ApolloLink((operation, forward) => {
  const token = Accounts._storedLoginToken();
  operation.setContext(() => ({
    headers: {
      "meteor-login-token": token
    }
  }));
  return forward(operation);
});

const cache = new InMemoryCache({
  dataIdFromObject: object => {
    switch (object.__typename) {
      case "Episode":
        return object.id;
      case "Podcast":
        return object.podcastId;
      case "UserData":
        return object._id;

      default:
        return defaultDataIdFromObject(object);
    }
  }
});

// persistCache({
//   cache,
//   storage: window.localStorage,
//   maxSize: 4194304 //4mb
// });

const defaultState = {
  playingEpisode: null,
  queue: []
};

const stateLink = withClientState({
  cache,
  resolvers: playingEpisode,
  defaults: defaultState
});

const client = new ApolloClient({
  // ORDER MATTER!!
  link: ApolloLink.from([authLink, stateLink, httpLink]),
  cache
});

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

Tracker.autorun(() => {
  const isNavOpen = Session.get("isNavOpen");
  document.body.classList.toggle("nav-is-open", isNavOpen);
});

Tracker.autorun(() => {
  const isPlayerOpen = Session.get("isPlayerOpen");
  document.body.classList.toggle("player-is-open", isPlayerOpen);
});

Meteor.startup(() => {
  Session.set("isSearchModelOpen", false);
  Session.set("isNavOpen", false);
  Session.set("isPlayerOpen", false);
  render(<ApolloApp />, document.getElementById("app"));
});
