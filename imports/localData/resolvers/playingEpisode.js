import { remove } from "lodash";

import getLocalPlayingEpisode from "./../queries/getLocalPlayingEpisode";
import getLocalUpnext from "./../queries/getLocalUpnext";

export default (resolvers = {
  Query: {
    localPlayingEpisode(_, __, { cache }) {
      const data = cache.readQuery({ query: getLocalPlayingEpisode });
      return data.localPlayingEpisode;
    },
    localUpnext(_, __, { cache }) {
      console.log("localUpnext query", cache);
      const data = cache.readQuery({ query: getLocalUpnext });
      return data.localUpnext;
    }
  },
  Mutation: {
    async setLocalPlayingEpisode(_, { id, podcastId }, { cache }) {
      let episodeData;
      let upnextData;
      let episode = await Meteor.callPromise("getEpisode", id, podcastId)
        .then(res => res)
        .catch(error => console.log("error in Meteor.callPromise", error));

      const prevEpisode = cache.readQuery({
        query: getLocalPlayingEpisode
      });

      episodeData = {
        localPlayingEpisode: {
          ...episode,
          playedSeconds: 0,
          __typename: "Episode"
        }
      };

      if (prevEpisode.localPlayingEpisode) {
        const prevUpnext = cache.readQuery({ query: getLocalUpnext });

        remove(
          prevUpnext.localUpnext,
          n => n.id === prevEpisode.localPlayingEpisode.id
        );
        prevUpnext.localUpnext.push(prevEpisode.localPlayingEpisode);
        upnextData = {
          localUpnext: prevUpnext.localUpnext
        };

        console.log("localupnext", upnextData);

        cache.writeQuery({ query: getLocalUpnext, data: upnextData });
      }

      cache.writeQuery({ query: getLocalPlayingEpisode, data: episodeData });

      return null;
    }
  }
});
