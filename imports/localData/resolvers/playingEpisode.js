import { remove } from "lodash";

import getLocalPlayingEpisodeQuery from "./../queries/getLocalPlayingEpisode";
import getLocalUpnextQuery from "./../queries/getLocalUpnext";

export default (resolvers = {
  Query: {
    localPlayingEpisode(_, __, { cache }) {
      const prevEpisode = getLocalEpisode(cache);

      if (!prevEpisode) {
        const prevUpnext = getLocalUpnext(cache);

        if (prevUpnext && prevUpnext.length) {
          const episode = prevUpnext.shift();

          const upnextData = {
            localUpnext: prevUpnext
          };

          const episodeData = {
            localPlayingEpisode: episode
          };

          setLocalEpisode(cache, episodeData);
          setLocalUpnext(cache, upnextData);

          return episode;
        }

        return null;
      }

      return prevEpisode;
    },
    localUpnext(_, __, { cache }) {
      return getLocalUpnext(cache);
    }
  },
  Mutation: {
    async setLocalPlayingEpisode(_, { id, podcastId }, { cache }) {
      let episodeData;
      let upnextData;
      let episode = await Meteor.callPromise("getEpisode", id, podcastId)
        .then(res => res)
        .catch(error => console.log("error in Meteor.callPromise", error));

      const prevEpisode = getLocalEpisode(cache);

      episodeData = {
        localPlayingEpisode: {
          ...episode,
          playedSeconds: 0,
          __typename: "Episode"
        }
      };

      if (prevEpisode) {
        const prevUpnext = getLocalUpnext(cache);

        remove(prevUpnext, n => n.id === prevEpisode.id || n.id === id);

        prevUpnext.unshift(prevEpisode);

        upnextData = {
          localUpnext: prevUpnext
        };

        setLocalUpnext(cache, upnextData);
      }

      setLocalEpisode(cache, episodeData);

      return null;
    },
    clearLocalPlayingEpisode(_, __, { cache }) {
      const data = {
        localPlayingEpisode: null
      };

      setLocalEpisode(cache, data);

      return null;
    },
    removeFromLocalUpnext(_, { id, podcastId }, { cache }) {
      const prevUpnext = getLocalUpnext(cache);
      remove(prevUpnext, n => n.id === id);

      const data = {
        localUpnext: prevUpnext
      };

      setLocalUpnext(cache, data);

      return null;
    }
  }
});

function getLocalEpisode(cache) {
  return cache.readQuery({ query: getLocalPlayingEpisodeQuery })
    .localPlayingEpisode;
}

function getLocalUpnext(cache) {
  return cache.readQuery({ query: getLocalUpnextQuery }).localUpnext;
}

function setLocalEpisode(cache, data) {
  cache.writeQuery({ query: getLocalPlayingEpisodeQuery, data });
}

function setLocalUpnext(cache, data) {
  cache.writeQuery({ query: getLocalUpnextQuery, data });
}
