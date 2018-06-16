import gql from "graphql-tag";

export default gql`
  mutation clearCurrentEpisode {
    clearCurrentEpisode @client {
      id
      podcastId
      podcastArtworkUrl
      title
      description
      author
      mediaUrl
      playedSeconds
      duration
      pubDate
      linkToEpisode
    }
  }
`;
