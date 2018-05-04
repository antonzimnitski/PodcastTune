import { Meteor } from "meteor/meteor";
import React from "react";
import { render } from "react-dom";
import ApolloClient, { HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import App from "./../../ui/App";

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

Meteor.startup(() => {
  render(<ApolloApp />, document.getElementById("app"));
});
