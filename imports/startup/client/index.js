import { Meteor } from "meteor/meteor";
import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import ApolloClient, { HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import App from "./../../ui/components/App";
import SideBar from "./../../ui/components/SideBar";
import Podcasts from "./../../ui/components/Podcasts";
import PodcastPage from "./../../ui/components/PodcastPage";
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
          <Route path="/" exact component={Podcasts} />
          <Route path="/podcasts/:podcastId" component={PodcastPage} />
          <Route path="/discover" exact component={Discover} />
          <Route path="/discover/:genreId" component={DiscoverByGenre} />
          <Redirect to="/" />
        </Switch>
      </div>
    </BrowserRouter>
  </ApolloProvider>
);

Meteor.startup(() => {
  render(<ApolloApp />, document.getElementById("app"));
});
