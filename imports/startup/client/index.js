import { Meteor } from "meteor/meteor";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ApolloClient, { HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import App from "./../../ui/components/App";
import SideBar from "./../../ui/components/SideBar";
import Discover from "./../../ui/components/Discover";
import DiscoverByGenre from "../../ui/components/DiscoverByGenre";

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
    <BrowserRouter>
      <div>
        <SideBar />
        <Switch>
          <Route path="/discover" exact component={Discover} />
          <Route path="/discover/:genreId" component={DiscoverByGenre} />
        </Switch>
      </div>
    </BrowserRouter>
  </ApolloProvider>
);

Meteor.startup(() => {
  render(<ApolloApp />, document.getElementById("app"));
});
