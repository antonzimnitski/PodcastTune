import getLocalPlayingEpisode from "./../queries/getLocalPlayingEpisode";

export default (resolvers = {
  Query: {
    playingEpisode(_, __, { cache }) {
      console.log("in localEpisode query");
      const data = cache.readQuery({ query: getLocalPlayingEpisode });
      console.log("in localEpisode after readQuery", data);
      return data.playingEpisode;
    }
  },
  Mutation: {
    async setPlayingEpisode(_, { id, podcastId }, { cache }) {
      let episode = await Meteor.callPromise("getEpisode", id, podcastId)
        .then(res => res)
        .catch(error => console.log("error in Meteor.callPromise", error));

      const data = {
        playingEpisode: {
          ...episode,
          playedSeconds: 0,
          __typename: "Episode"
        }
      };

      console.log("in setPlayingEpisodeLocal query");

      cache.writeData({ data });

      return null;
    }
  }
});
