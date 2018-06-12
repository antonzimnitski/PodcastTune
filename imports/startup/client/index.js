import { Meteor } from "meteor/meteor";
import React from "react";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";
import { render } from "react-dom";
import ApolloClient, { HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import "whatwg-fetch";

import App from "./../../ui/components/App";

const httpLink = new HttpLink({
  uri: Meteor.absoluteUrl("graphql")
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  link: httpLink,
  cache
});

const ApolloApp = () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

Tracker.autorun(() => {
  const isPlayerOpen = Session.get("isPlayerOpen");
  document.body.classList.toggle("player-is-open", isPlayerOpen);
});

Meteor.startup(() => {
  //https://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage#2010948
  const episode = JSON.parse(localStorage.getItem("episode"));
  Session.set("episode", episode);
  Session.set("isPlayerOpen", !!episode ? true : false);
  render(<ApolloApp />, document.getElementById("app"));
});
