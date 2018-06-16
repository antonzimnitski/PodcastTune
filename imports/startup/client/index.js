import { Meteor } from "meteor/meteor";
import React from "react";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";
import { render } from "react-dom";
import { HttpLink, InMemoryCache, ApolloLink } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import "whatwg-fetch";
import ApolloClient from "apollo-client";

import { queueSplice } from "./../../ui/utils/utils";

import App from "./../../ui/components/App";
import { withClientState } from "apollo-link-state";

import getCurrentEpisode from "./../../../imports/ui/queries/getCurrentEpisode";
import getQueue from "./../../../imports/ui/queries/getQueue";

const httpLink = new HttpLink({
  uri: Meteor.absoluteUrl("graphql")
});

const cache = new InMemoryCache();

const defaultState = {
  currentEpisode: null,
  queue: []
};

const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      updateCurrentEpisode: (_, { episode }, { cache }) => {
        const prevEpisodeState = cache.readQuery({ query: getCurrentEpisode });

        if (prevEpisodeState.currentEpisode) {
          const prevQueueState = cache.readQuery({ query: getQueue });
          let queue;
          if (!prevQueueState.queue) {
            queue = [prevEpisodeState.currentEpisode];
          } else {
            const exists = prevQueueState.queue.findIndex(
              el =>
                el.title === episode.title ||
                el.title === prevEpisodeState.currentEpisode.title
            );
            queue =
              exists === -1
                ? [prevEpisodeState.currentEpisode, ...prevQueueState.queue]
                : [
                    prevEpisodeState.currentEpisode,
                    ...queueSplice(prevQueueState.queue, exists)
                  ];
          }
          const dataQueue = {
            ...prevQueueState,
            queue
          };

          cache.writeData({ query: getQueue, data: dataQueue });
        }

        const dataEpisode = {
          ...prevEpisodeState,
          currentEpisode: {
            ...episode
          }
        };

        cache.writeData({ query: getCurrentEpisode, data: dataEpisode });
        return null;
      }
    }
  }
});

const client = new ApolloClient({
  link: ApolloLink.from([stateLink, httpLink]),
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
  Session.set("isSearchModelOpen", false);
  //https://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage#2010948
  // const queue = JSON.parse(localStorage.getItem("queue"));
  // Session.set("queue", queue);
  Session.set("isPlayerOpen", false);
  render(<ApolloApp />, document.getElementById("app"));
});
