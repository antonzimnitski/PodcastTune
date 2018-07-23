import gql from "graphql-tag";

export default (resolvers = {
  Query: {
    playingEpisode(_, __, { cache }) {
      const data = cache.readQuery({ query: LOCAL_EPISODE });

      return data.playingEpisode;
    }
  },
  Mutation: {
    async setPlayingEpisodeLocal(_, { id, podcastId }, { cache }) {
      let episode = await Meteor.callPromise("getEpisode", id, podcastId)
        .then(res => res)
        .catch(error => console.log("error in Meteor.callPromise", error));

      const data = {
        playingEpisode: {
          ...episode,
          __typename: "Episode"
        }
      };

      cache.writeData({ data });

      return null;
    }
  }
});

const LOCAL_EPISODE = gql`
  query playingEpisode {
    playingEpisode @client {
      id
      podcastId
      podcastArtworkUrl
      title
      mediaUrl
      pubDate
      author
    }
  }
`;
