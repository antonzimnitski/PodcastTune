import "core-js/es6";

import { Meteor } from "meteor/meteor";
import React from "react";
import { Session } from "meteor/session";
import { Tracker } from "meteor/tracker";
import { render } from "react-dom";
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
  currentEpisode: null,
  queue: []
};

// const defaultState = {
//   currentEpisode: null,
//   queue: null
// };

// const stateLink = withClientState({
//   cache,
//   defaults: defaultState,
//   resolvers: {
//     Mutation: {
//       updatePlayerSeconds: (_, { playedSeconds }, { cache }) => {
//         //https://github.com/apollographql/apollo-link-state/blob/master/examples/todo/src/resolvers.js
//         const previous = cache.readQuery({ query: getCurrentEpisode });

//         const data = {
//           currentEpisode: {
//             ...previous.currentEpisode,
//             playedSeconds: playedSeconds
//           }
//         };

//         setStorageValue("currentEpisode", data.currentEpisode);
//         cache.writeData({
//           query: getCurrentEpisode,
//           data
//         });

//         return null;
//       },

//       updateCurrentEpisode: (_, { episode }, { cache }) => {
//         const prevEpisodeState = cache.readQuery({
//           query: getCurrentEpisode
//         });
//         if (prevEpisodeState.currentEpisode) {
//           const prevQueueState = cache.readQuery({ query: getQueue });
//           let queue;
//           if (!prevQueueState.queue) {
//             queue = [prevEpisodeState.currentEpisode];
//           } else {
//             const exists = prevQueueState.queue.findIndex(
//               el =>
//                 el.title === episode.title ||
//                 el.title === prevEpisodeState.currentEpisode.title
//             );
//             queue =
//               exists === -1
//                 ? [prevEpisodeState.currentEpisode, ...prevQueueState.queue]
//                 : [
//                     prevEpisodeState.currentEpisode,
//                     ...queueSplice(prevQueueState.queue, exists)
//                   ];
//           }
//           const dataQueue = {
//             ...prevQueueState,
//             queue
//           };

//           setStorageValue("queue", queue);
//           cache.writeData({ query: getQueue, data: dataQueue });
//         }

//         const dataEpisode = {
//           ...prevEpisodeState,
//           currentEpisode: {
//             ...episode
//           }
//         };

//         setStorageValue("currentEpisode", episode);
//         cache.writeData({
//           query: getCurrentEpisode,
//           data: dataEpisode
//         });
//         return null;
//       },
//       clearCurrentEpisode: (_, __, { cache }) => {
//         const prevEpisodeState = cache.readQuery({ query: getCurrentEpisode });
//         const prevQueueState = cache.readQuery({ query: getQueue });

//         let currentEpisode = null;
//         if (prevQueueState.queue) {
//           currentEpisode = prevQueueState.queue.splice(0, 1)[0];
//         }

//         const dataQueue = {
//           ...prevQueueState,
//           queue: prevQueueState.queue
//         };
//         const dataEpisode = {
//           ...prevEpisodeState,
//           currentEpisode
//         };

//         setStorageValue("queue", currentEpisode);
//         cache.writeData({ query: getQueue, data: dataQueue });

//         setStorageValue("currentEpisode", prevQueueState.queue);
//         cache.writeData({ query: getCurrentEpisode, data: dataEpisode });
//         return null;
//       }
//     }
//   }
// });

const client = new ApolloClient({
  // ORDER MATTER!!
  link: ApolloLink.from([authLink, httpLink]),
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
